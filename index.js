var Xray = require('x-ray')
var request = require('request')
var fs = require('fs')
var searchParams = ["eztv", "Magnet Link", "720p"]
var finalLinks = []
var x = Xray()
// Series Arr just give the correct name and you are goood to go.
var series_arr = ['Flash', "Arrow", "Supergirl","Legends of Tomorrow"]
// var series_arr = []
var previous_title_arr = []
fs.readFile('titles.txt', 'utf-8', (error, data) => {
  if (data)
    previous_title_arr = data.split('\n')
})
fs.writeFile('results.txt', '', (err) => console.log("REsult File", err))
series_arr.forEach((name) => {
  let urlName = name.replace(/ /g,'%20');
  x(`https://eztv.io/search/${urlName}`, '.forum_header_border', [{
    tds: x('.forum_thread_post', [{
      title: 'a@title',
      links: 'a@href'
    }])
  }])(function (err, obj) {
    if(obj){
    obj.splice(0, 2)
    let tds_list = obj[0]['tds']
    tds_list.splice(25, tds_list.length)
    if (searchParams.length > 3)
      searchParams.shift()
    searchParams.unshift(name)
    console.log(`#############################${name}############################`)
    let result_found = false
    let previous_title_index = previous_title_arr.findIndex(title => title.includes(name))
    let previous_title = previous_title_index >= 0 ? previous_title_arr[previous_title_index] : null
    console.log("Last Aired Episode", previous_title)
    tds_list.forEach((element, index) => {
      let result_arr = []
      let title_exists = false
      searchParams.forEach((param) => {
        if (element.title.includes(param)) {
          result_arr.push(1)
        }
      })
      if (result_arr.length === searchParams.length && !result_found) {
        if (previous_title) {
          let previous_title_iNTERNAL_index = previous_title.indexOf("iNTERNAL")
          let previous_title_episode = previous_title.slice(previous_title_iNTERNAL_index - 7, previous_title_iNTERNAL_index).trim()
          let current_title_iNTERNAL_index = element.title.indexOf("iNTERNAL")
          let current_title_episode = element.title.slice(current_title_iNTERNAL_index - 7, current_title_iNTERNAL_index).trim()
          if (previous_title_episode === current_title_episode) {
            title_exists = true
            result_found = true
          }
        }
        if (!title_exists) {
          let trimmed_title = element.title.trim()
          let size = parseInt(trimmed_title.slice(trimmed_title.indexOf("[eztv]") + 8, trimmed_title.indexOf("Magnet") - 4))
          console.log("SIZE", size)
          if (size >= 500 && size <= 999) {
            if (previous_title) {
              previous_title_arr.splice(previous_title_index, 1)
              let previous_title_for_file = previous_title_arr.join("\n")
              fs.writeFile(`titles.txt`, `${previous_title_for_file}`, (err) => console.log(err))
            }
            console.log("This Week Episode", element.title)
            result_found = true
            searchParams.shift(name)
            // fs.writeFile(`results_${name}.txt`, element.links)
            fs.appendFile(`titles.txt`, `${element.title}\n`, (err) => { })
            fs.appendFile(`results.txt`, `${element.links}\n`, (err) => console.log(err))
          }else{
            console.log("No desired result found for this week :(")
          }
        }else{
          console.log(`This week ${name} episode wasn't aired :(`)
        }
      }
    })
    }
  })
})

