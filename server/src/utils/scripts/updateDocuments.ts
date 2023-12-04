const mongoose = require('mongoose');
import { User } from 'src/schemas/user.schema';

console.log(process.env)

// async function updateExistingDocuments() {
//   await mongoose.connect('mongodb://localhost:27017/yourDatabase', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false,
//   });

//   const filter = { newField: { $exists: false } };
//   const update = { $set: { newField: 'defaultValue' } };
//   const options = { multi: true };

//   await User.updateMany(filter, update, options, (err, res) => {
//     if (err) {
//       console.error('Error updating documents:', err);
//     } else {
//       console.log('Documents updated:', res.nModified);
//     }
//     mongoose.connection.close();
//   });
// }

// updateExistingDocuments();
