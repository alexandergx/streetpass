import { Injectable, } from '@nestjs/common'
import { Context, } from '@nestjs/graphql'
import { InjectModel, } from '@nestjs/mongoose'
import mongoose, { LeanDocument, Model, } from 'mongoose'
import { User, UserDocument, } from 'src/schemas/user.schema'
import { JwtService, } from '@nestjs/jwt'
import { AuthDecodedToken, } from '../auth/auth.entities'
import { GraphQLError, } from 'graphql'
import { Errors, NotificationType, OS, } from 'src/utils/constants'
import { SendPushNotification, getPresignedUrl, sendPushNotification, } from 'src/utils/services'
import { GetNotificationsDto, RemoveNotificationDto, SetLastSeenNotificationDto } from './notifications.dto'
import { UserNotification, NotificationsPagination } from './notifications.entities'
import { UserChats, UserChatsDocument } from 'src/schemas/userChats.schema'
import { UserPost, UserPosts, UserPostsDocument } from 'src/schemas/userPosts.schema'
import { Notifications, NotificationsDocument } from 'src/schemas/notifications.schema'

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notifications.name) private notificationsModel: Model<NotificationsDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(UserPosts.name) private userPostsModel: Model<UserPostsDocument>,
    @InjectModel(UserChats.name) private userChatsModel: Model<UserChatsDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async createNotification(notification: SendPushNotification, user: UserDocument | LeanDocument<UserDocument>, write: boolean = true): Promise<boolean> {
    if (user.notificationPreferences[notification.payload.type] || user.notificationPreferences[notification.payload.type] === undefined) {
      let newNotification = {
        notificationID: notification.payload.notificationID || '',
        type: notification.payload.type,
        userId: notification.payload.userId,
        authUserId: notification.payload.authUserId,
        postId: notification.payload.postId,
        date: new Date().toISOString(),
      }
      const userNotifications = await this.notificationsModel.findOne({ userId: user._id, }).lean()
      let notifications = userNotifications.notifications
      let lastSeenNotificationID: string = userNotifications.lastSeenNotificationID
      let pass: boolean = false
      switch (notification.payload.type) {
        case NotificationType.Follow:
        case NotificationType.Request:
        case NotificationType.Accept:
        case NotificationType.Like:
          const duplicateNotificationIndex = notifications.findIndex(i =>
            (i.type === notification.payload.type && i.userId === newNotification.userId && i.postId === newNotification.postId)
            || (i.type === NotificationType.Follow && newNotification.type === NotificationType.Follow && i.userId === newNotification.userId)
            || (i.type === NotificationType.Request && newNotification.type === NotificationType.Request && i.userId === newNotification.userId)
            || (i.type === NotificationType.Accept && newNotification.type === NotificationType.Accept && i.userId === newNotification.userId)
          )
          if (duplicateNotificationIndex >= 0) {
            if (notifications[duplicateNotificationIndex].notificationID === lastSeenNotificationID) {
              lastSeenNotificationID = notifications[duplicateNotificationIndex + 1]?.notificationID || null
            }
            newNotification = {
              ...notifications[duplicateNotificationIndex],
              date: new Date().toISOString(),
            }
            notifications.splice(duplicateNotificationIndex, 1)
          }
          break
        case NotificationType.Comment:
        case NotificationType.Reply:
        case NotificationType.Subscribed:
          break
        case NotificationType.Message:
        case NotificationType.StreetPass:
          pass = true
        default:
          break
      }
      if (!pass) {
        notifications = [newNotification, ...notifications].slice(0, 99)
        await this.notificationsModel.updateOne({ userId: user._id, }, { $set: { notifications: notifications, lastSeenNotificationID: lastSeenNotificationID, }})
      }
      if (!write) {
        sendPushNotification({ ...notification, payload: { ...notification.payload, }, unread: undefined, }).then(removeTokens => {
          if (removeTokens[OS.ios].length || removeTokens[OS.android].length) {
            this.userModel.updateOne(
              { userId: user._id, },
              { $pull: { 'deviceTokens.Apple': { $in: removeTokens[OS.ios], }, 'deviceTokens.Google': { $in: removeTokens[OS.android], }, }, },
            )
          }
        }).then(() => {})
        return true
      }
      const lastSeenNotificationIndex = notifications.findIndex(i => i.notificationID === lastSeenNotificationID)
      const { chats, } = await this.userChatsModel.findOne({ userId: user._id, }).lean() ?? {}
      const unread = ((lastSeenNotificationIndex >= 0 ? lastSeenNotificationIndex : notifications.length) || 0) + (chats?.reduce((count, chat) => chat.unread ? count + 1 : count, 0) || pass ? 1 : 0)
      sendPushNotification({ ...notification, payload: { ...notification.payload, ...newNotification, }, unread, }).then(removeTokens => {
        if (removeTokens[OS.ios].length || removeTokens[OS.android].length) {
          this.userModel.updateOne(
            { userId: user._id, },
            { $pull: { 'deviceTokens.Apple': { $in: removeTokens[OS.ios], }, 'deviceTokens.Google': { $in: removeTokens[OS.android], }, }, },
          )
        }
      }).then(() => {})
      return true
    }
    return false
  }

  async getNotifications(input: GetNotificationsDto, @Context() context: any): Promise<NotificationsPagination> {
    const { userId, } = this.jwtService.decode(context.req.headers['access-token']) as AuthDecodedToken
    const authUserNotifications = await this.notificationsModel.findOne({ userId: userId, }).lean()
    const notificationsList = authUserNotifications.notifications
    const index = input.index ? notificationsList.findIndex(i => i.notificationID === input.index) + 1 : input.page !== undefined ? (input.page > 0 ? input.page * 20 : 20) : 0
    let filteredList = notificationsList.slice(index, index + 20)
    if (input.updateIndex) {
      const updateIndex = filteredList.findIndex(notification => notification.notificationID === input.updateIndex)
      if (updateIndex >= 0) filteredList = filteredList.slice(0, updateIndex)
    }
    let notifications: Array<UserNotification> = []
    for (const notification of filteredList) {
      const user = await this.userModel.findOne({ _id: new mongoose.mongo.ObjectId(notification.userId), }).lean()
      let post: UserPost = undefined
      if (notification.postId) {
        const { posts: [authPost] = [], } = await this.userPostsModel.findOne(
          { userId: notification.authUserId || userId, posts: { $elemMatch: { postId: notification.postId, }, }, },
          { 'posts.$': 1, },
        ).lean() ?? {}
        post = authPost
      }
      notifications.push({
        notificationID: notification.notificationID || 'null',
        userId: notification.userId,
        authUserId: notification.authUserId,
        postId: notification.postId,
        type: notification.type,
        username: user?.username || 'Deleted user',
        name: user?.name,
        profilePicture: user?.profilePicture,
        image: getPresignedUrl(post?.image),
        video: getPresignedUrl(post?.video),
        compact: getPresignedUrl(post?.compact),
        thumbnail: getPresignedUrl(post?.thumbnail),
        coordinates: post?.coordinates,
        date: notification.date,
      })
    }
    const lastSeenNotificationID = notificationsList[0]?.notificationID
    if (lastSeenNotificationID) await this.notificationsModel.updateOne({ userId: userId, }, { $set: { lastSeenNotificationID: lastSeenNotificationID, }, })
    return {
      notifications: notifications,
      page: notificationsList[notificationsList.length - 1]?.notificationID === filteredList[filteredList.length - 1]?.notificationID ? -1 : input.page !== undefined ? input.page + 1 : 0,
    }
  }

  async removeNotification(input: RemoveNotificationDto, @Context() context: any): Promise<boolean> {
    const { userId, } = this.jwtService.decode(context.req.headers['access-token']) as AuthDecodedToken
    const authUserNotification = await this.notificationsModel.updateOne({ userId: userId, }, { $pull: { notifications: { notificationID: input.notificationID, }, }, })
    if (authUserNotification?.modifiedCount) return true
    throw new GraphQLError(Errors.NotFound)
  }

  async setLastSeenNotification(input: SetLastSeenNotificationDto, @Context() context: any): Promise<boolean> {
    const { userId, } = this.jwtService.decode(context.req.headers['access-token']) as AuthDecodedToken
    const authUserNotifications = await this.userModel.updateOne({ userId: userId, }, { $set: { lastSeenNotificationID: input.notificationID, }, })
    if (authUserNotifications) return true
    throw new GraphQLError(Errors.GeneralError)
  }
}
