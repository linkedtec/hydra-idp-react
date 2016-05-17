module.exports = {
  'Webpage has the correct title'(client) {
    client
      .url(client.launch_url)
      .waitForElementVisible('body', 1000)
      .assert.title('Hydra Identity Provider Example')
      .end()
  }
}
