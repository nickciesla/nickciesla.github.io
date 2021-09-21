var curWeek = 0

function convert_date(old_date) {
  var date_str = new Date(old_date).toLocaleString('en-US', {
    timeZone: "America/New_York"
  })

  return new Date(date_str)
}

function getDetails(data, i) {
  var details

  if (typeof data.events[i].competitions[0].odds != 'undefined') {
    details = data.events[i].competitions[0].odds[0].details
  } else {
    if (typeof data.events[i].competitions[0].situation != 'undefined') {
      details = data.events[i].competitions[0].situation.lastPlay.text
    } else {
      if (typeof data.events[i].competitions[0].headlines != 'undefined') {
        details = data.events[i].competitions[0].headlines[0].shortLinkText
      } else {
        details = ''
      }
    }
  }

  return details
}

function get_scores(week) {
  $.getJSON('https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?week=' + week, function(data) {
    var total = 0
    var total1 = 0
    var total4 = 0
    var totalOverUnder = 0
    var tempWeek = data.week.number
    var details = ''

    $('#week_label').text(tempWeek)

    for (let i = 0; i < data.events.length; i++) {

      var merica_date = convert_date(data.events[i].date)
      var text = ''
      var game_time = convert_date(data.events[i].date)
      game_time = game_time.getHours() - 12

      details = getDetails(data, i)

      text += data.events[i].competitions[0].competitors[1].team.abbreviation + ' ';
      text += data.events[i].competitions[0].competitors[1].score + ' - ';
      text += data.events[i].competitions[0].competitors[0].team.abbreviation + ' ';
      text += data.events[i].competitions[0].competitors[0].score + '\t';

      var team1 = data.events[i].competitions[0].competitors[1].team.logo
      var team2 = data.events[i].competitions[0].competitors[0].team.logo

      var appendText = '<div class="row text-center border-top border-left border-right align-items-center"><div class="col-sm"><label class="boxscore">' + details + '</label></div></div><div class="row text-center border-bottom border-left border-right align-items-center">'

      if (typeof data.events[i].competitions[0].competitors[1].winner != 'undefined') {
        if (data.events[i].competitions[0].competitors[1].winner) {
          appendText += '<div class="col-sm"><h3><label class="badge badge-success">W</label></h3></div>'
        } else {
          appendText += '<div class="col-sm"><h3><label class="badge badge-danger">L</label></h3></div>'
        }
      }

      appendText += '<div class="col-sm"><img src="' + team1 + '" width="80" height="80"></div><div class="col-sm"><label class="boxscore">' + text + '</label></div><div class="col-sm"><img src="' + team2 + '" width="80" height="80"></div>'

      if (typeof data.events[i].competitions[0].competitors[0].winner != 'undefined') {
        if (data.events[i].competitions[0].competitors[0].winner) {
          appendText += '<div class="col-sm"><h3><label class="badge badge-success">W</label></h3></div>'
        } else {
          appendText += '<div class="col-sm"><h3><label class="badge badge-danger">L</label></h3></div>'
        }
      }

      appendText += '</div>'

      if (merica_date.getDay() == 0) {
        $('#sunday').append(appendText);
      }
      if (merica_date.getDay() == 1) {
        $('#monday').append(appendText);
      }
      if (merica_date.getDay() == 4) {
        $('#thursday').append(appendText);
      }



      if (merica_date.getDay() == 0) {
        if (typeof data.events[i].competitions[0].odds != 'undefined') {
          totalOverUnder += parseInt(data.events[i].competitions[0].odds[0].overUnder)
        }
        total += parseInt(data.events[i].competitions[0].competitors[1].score)
        total += parseInt(data.events[i].competitions[0].competitors[0].score)
        if (game_time == 1) {
          total1 += parseInt(data.events[i].competitions[0].competitors[1].score)
          total1 += parseInt(data.events[i].competitions[0].competitors[0].score)
        }
        if (game_time == 4) {
          total4 += parseInt(data.events[i].competitions[0].competitors[1].score)
          total4 += parseInt(data.events[i].competitions[0].competitors[0].score)
        }
      }

    }

    $('#bets').append('<div class="row text-center align-items-center"><div class="col-sm"></div><div class="col-sm"><label class="boxscore">Caesars Total Over Under: ' + totalOverUnder + '</label><label class="boxscore">Hanson Bet Total: ' + total + '</label><label class="boxscore">1:00 PM Total: ' + total1 + '</label><label class="boxscore">4:00 PM Total: ' + total4 + '</label></div><div class="col-sm"></div></div>');
  })
}

$(document).ready(function() {
  $.getJSON('https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard', function(data) {
    $('#week a').on('click', function() {

      $("#thursday").empty();
      $("#sunday").empty();
      $("#monday").empty();
      $("#bets").empty();

      $("#thursday").append('<div class="row text-center align-items-center"> <div class="col-sm"><h1><span class="badge badge-primary">Thursday</span></h1></div><div class="col-sm"></div><div class="col-sm"></div></div>')
      $("#sunday").append('<div class="row text-center align-items-center"> <div class="col-sm"><h1><span class="badge badge-primary">Sunday</span></h1></div><div class="col-sm"></div><div class="col-sm"></div></div>')
      $("#monday").append('<div class="row text-center align-items-center"> <div class="col-sm"><h1><span class="badge badge-primary">Monday</span></h1></div><div class="col-sm"></div><div class="col-sm"></div></div>')

      get_scores(($(this).text()))
    });

    curWeek = data.week.number
    get_scores(curWeek)
  })
})
