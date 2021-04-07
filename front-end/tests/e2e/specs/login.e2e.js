module.export = {
  "login test": function(browser) {
    browser
      .url(process.env.VUE_DEV_SERVER_URL + "login")
      .waitForElementVisible("#app", 6000)
      .assert.containsText("h1", "TaskAgile")
      .end();
  }
};
