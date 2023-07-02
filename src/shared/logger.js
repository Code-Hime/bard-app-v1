export const logger = {
  info(message, data) {
    console.error(`Log: ${message}`);
    if (data) {
      console.error(JSON.stringify(data, null, 2));
    }
  }
};
