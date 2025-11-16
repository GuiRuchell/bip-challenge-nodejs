export default {
  testEnvironment: "node", // Node.js
  transform: {},            // sem Babel
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1.js" // corrige imports relativos
  },
  verbose: true
};
