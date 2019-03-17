var Xray = require('x-ray')
var request = require('request')
var fs = require('fs')
var searchParams = ["eztv", "Magnet Link", "720p"]
var finalLinks = []
var x = Xray()
// Series Arr just give the correct name and you are goood to go.
var series_arr = ['Flash', "Arrow", "Supergirl"]

series_arr.forEach((name) => {
  x(`https://eztv.io/search/${name}`, '.forum_header_border', [{
    tds: x('.forum_thread_post', [{
      title: 'a@title',
      links: 'a@href'
    }])
  }])(function (err, obj) {
    obj.splice(0, 2)
    let tds_list = obj[0]['tds']
    tds_list.splice(25, tds_list.length)
    if (searchParams.length > 3)
      searchParams.shift()
    searchParams.unshift(name)
    console.log(`#############################${name}############################`)
    let result_found = false
    tds_list.forEach((element, index) => {
      let result_arr = []
      searchParams.forEach((param) => {
        if (element.title.includes(param)) {
          result_arr.push(1)
        }
      })
      if (result_arr.length === searchParams.length && !result_found) {
        // console.log(element.title)
        let trimmed_title = element.title.trim()
        let size = parseInt(trimmed_title.slice(trimmed_title.indexOf("[eztv]") + 8, trimmed_title.indexOf("Magnet") - 4))
        console.log("SIZE", size)
        if (size >= 500 && size <= 900) {
          console.log("Title", element.title)
          result_found = true
          searchParams.shift(name)
          // fs.writeFile(`results_${name}.txt`, element.links)
          fs.appendFile(`results.txt`, `${element.links}\n`, (err) => {
          })
          // var client = new WebTorrent
          // client.add(`${element.links}`, function (torrent) {
          //   console.log(torrent)
          // })
        }
      }
    })
  })
})

