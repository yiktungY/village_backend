module.exports = {
  development: {
    client: "mysql",
    connection: {
      host: "127.0.0.1",
      user: "root",
      password: "rootroot",
      database: "village_database",
      charset: "utf8",
    },
  },
  production: {
    host: "ro2padgkirvcf55m.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "z8sqws7axd2mi1nk",
    password: "qvbjl8qqn0y0r1fw",
    database: "village_database",
    port: "3308",
    Database: "grqdn5xptvibl21s",
  },
};
// const connections = {
//   development: {
//     client: "mysql",
//     connection: {
//       host: "127.0.0.1",
//       user: "root",
//       password: "rootroot",
//       database: "village_database",
//       charset: "utf8",
//     },
//   },
//   production: {
//     client: "mysql",
//     connection: process.env.JAWSDB_URL,
//   },
// };

// module.exports =
//   process.env.NODE_ENV === "production"
//     ? connections.production
//     : connections.development;
