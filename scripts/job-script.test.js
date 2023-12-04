/* eslint-disable no-undef */

// const jobScript = require("./job-script");

// const keywords = ["web developer", "plumber"];

// describe("fetchAllData function", () => {
//   it("should fetch data for each keyword", () => {
//     jobScript.fetchAllData(keywords).then((data) => {
//       expect(data.length).toEqual(2);
//       expect(data[0].name).toEqual("web developer");
//       expect(data[1].name).toEqual("plumber");
//     });
//   });

//   it("should include correct properties", () => {
//     const correctData = ["name", "count", "month", "year"];

//     jobScript.fetchAllData(keywords).then((data) => {
//       data.forEach((item) => expect(Object.keys(item)).toEqual(correctData));
//     });
//   });

//   it("get correct count", () => {
//     jobScript.fetchAllData(keywords).then((data) => {
//       // Assert that there are more web developers than plumbers
//       expect(data[0].count).toBeGreaterThan(data[1].count);
//     });
//   });
// });
