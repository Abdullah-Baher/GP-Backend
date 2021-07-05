const mongoose = require('mongoose');

mongoose.connect((process.env.ENVIRONMENT) === 'dev'? process.env.MONGOURIDEV:
process.env.MONGOURIPROD ,
{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  () => {
      console.log('Connected to DB');
  });