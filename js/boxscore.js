var curWeek = 0

function convert_date(old_date) {
  var date_str = new Date(old_date).toLocaleString('en-US', {
    timeZone: "America/New_York"
  })

  return new Date(date_str)
}

function get_scores(week) {

  $("#scores").empty();
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

      //$('#thursday').append('<label>' + merica_date.getDay() + '</label><label>' + data.events[i].name + '</label>');


      text += data.events[i].competitions[0].competitors[1].team.abbreviation + ' ';
      text += data.events[i].competitions[0].competitors[1].score + ' - ';
      text += data.events[i].competitions[0].competitors[0].team.abbreviation + ' ';
      text += data.events[i].competitions[0].competitors[0].score + '\t';

      var team1 = data.events[i].competitions[0].competitors[1].team.logo
      var team2 = data.events[i].competitions[0].competitors[0].team.logo

      $('#scores').append('<div class="row text-center border-top border-left border-right align-items-center"><div class="col-sm"><label class="boxscore">' + details + '</label></div></div><div class="row text-center border-bottom border-left border-right align-items-center"><div class="col-sm"><img src="' + team1 + '" width="80" height="80"></div><div class="col-sm"><label class="boxscore">' + text + '</label></div><div class="col-sm"><img src="' + team2 + '" width="80" height="80"></div></div>');


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

    $('#scores').append('<div class="row text-center align-items-center"><div class="col-sm"></div><div class="col-sm"><label class="boxscore">Caesars Total Over Under: ' + totalOverUnder + '</label><label class="boxscore">Hanson Bet Total: ' + total + '</label><label class="boxscore">1:00 PM Total: ' + total1 + '</label><label class="boxscore">4:00 PM Total: ' + total4 + '</label></div><div class="col-sm"></div></div>');
  })
}

$(document).ready(function() {
  $.getJSON('https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard', function(data) {
    $('#week a').on('click', function() {
      var txt = ($(this).text());
      get_scores(txt)
    });

    $('#week_label').text(data.week.number)
    curWeek = data.week.number
    get_scores(data.week.number)
  })
})
