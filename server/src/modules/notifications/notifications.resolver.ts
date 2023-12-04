import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql'
import { NotificationsService } from './notifications.service'
import { NotificationsPagination } from './notifications.entities'
import { GetNotificationsDto, RemoveNotificationDto, SetLastSeenNotificationDto } from './notifications.dto'
import { AuthGuard } from '../auth/auth.service'
import { UseGuards } from '@nestjs/common'

@Resolver()
export class NotificationsResolver {
  constructor(private notificationsService: NotificationsService) {}

  @Query(() => NotificationsPagination)
  @UseGuards(AuthGuard)
  async getNotifications(@Args('input') input: GetNotificationsDto, @Context() context: any) {
    return this.notificationsService.getNotifications(input, context)
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard)
  async removeNotification(@Args('input') input: RemoveNotificationDto, @Context() context: any) {
    return this.notificationsService.removeNotification(input, context)
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard)
  async setLastSeenNotification(@Args('input') input: SetLastSeenNotificationDto, @Context() context: any) {
    return this.notificationsService.setLastSeenNotification(input, context)
  }
}
