// export const natsWrapper = {
//   client: {
//     publish: (subject: string, data: string, callback: () => void) => {
//       callback();
//     },
//   },
// };


// __mocks__/nats-wrapper.ts
export const natsWrapper = {
  client: {
    publish: jest.fn().mockImplementation(
      (subject: string, data: string, callback: () => void) => {
        callback(); // simulate successful publish
      }
    )
  }
};
