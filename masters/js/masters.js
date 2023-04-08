//masters
const scores = Object() 
const teams = Object()
const withdrawn = ['K. Na', 'W. Zalatoris', 'L. Oosthuizen']
const cut = 53

teams['Voor'] = ['R. McIlroy', 'J. Rahm', 'T. Hoge', 'T. Kim', 'K. Kitayama', 'H. English']
teams['KG'] = ['S. Scheffler', 'J. Rahm', 'A. Scott', 'S. Theegala', 'H. Varner III', 'C. Schwartzel']
teams['Bavis'] = ['S. Scheffler', 'J. Rahm', 'T. Hoge', 'C. Kirk', 'A. Svensson', 'K. Kitayama']
teams['Macey'] = ['X. Schauffele', 'J. Rahm', 'K. Bradley', 'S. Power', 'A. Svensson', 'S. Straka']
teams['Healey'] = ['M. Homa', 'T. Finau', 'M. Pereira', 'S. Power', 'K. Na', 'S. Straka']
teams['Coughlin'] = ['S. Scheffler', 'C. Morikawa', 'T. Kim', 'S. Kim', 'A. Svensson', 'C. Champ']
teams['Okeefe'] = ['S. Scheffler', 'J. Rahm', 'T. Kim', 'S. Theegala', 'H. English', 'A. Svensson']
teams['Ciesla'] = ['S. Scheffler', 'J. Rahm', 'T. Kim', 'M. Pereira', 'C. Champ', 'K. Kitayama']
teams['Doug'] = ['P. Cantlay', 'X. Schauffele', 'T. Hoge', 'B. Harman', 'K.H. Lee', 'S. Straka']
teams['Tim'] = ['J. Rahm', 'C. Smith', 'T. Kim', 'S. Kim', 'K. Kitayama', 'H. English']

$(document).ready(function() {
  
  $.getJSON('https://site.api.espn.com/apis/site/v2/sports/golf/pga/scoreboard', function(data) {

    for (let i = 0; i < 88; i++) {
      ath = data.events[0].competitions[0].competitors[i]
      golfer = ath.athlete.shortName
      score = ath.score
      pos = i + 1

      if (typeof ath.linescores[0] != 'undefined') {
        if (typeof ath.linescores[0].value != 'undefined') {
          day1 = ath.linescores[0].value
        } else {
          day1 = 77
        }
      } else {
        day1 = 77
      }

      if (typeof ath.linescores[1] != 'undefined') {
        if (typeof ath.linescores[1].value != 'undefined') {
          day2 = ath.linescores[1].value
        } else {
          day2 = 77
        }
      } else {
        day2 = 77
      }

      if (typeof ath.linescores[2] != 'undefined') {
        if (typeof ath.linescores[2].value != 'undefined') {
          day3 = ath.linescores[2].value
        } else {
          day3 = 77
        }
      } else {
        day3 = 77
      }

      if (typeof ath.linescores[3] != 'undefined') {
        if (typeof ath.linescores[3].value != 'undefined') {
          day4 = ath.linescores[3].value
        } else {
          day4 = 77
        }
      } else {
        day4 = 77
      }
      scores[golfer] = [pos, score, day1, day2, day3, day4]
    }
    console.log(scores)

    for (let [golfer, score] of Object.entries(scores)) {
      if (score[0] > cut && !withdrawn.includes(golfer)) {
        score[1] = '+' + (parseInt(score[1]) + 10)
      }
    }

    for (let [name, golfers] of Object.entries(teams)) {
      $("#teamscores").append('<div class="row text-center align-items-center"><h1><span class="badge badge-md">' + name + '</span></h1></div>')
      score_count = 0
      score_total = 0
      for (var [golfer, score] of Object.entries(scores)) {
        wrote = false
        if (golfers.includes(golfer)) {
          if (withdrawn.includes(golfer)) {
            score = ['', '+100', 77, 77, 77, 77]
          }
          if (score_count < 4) {
            if (score[1] != 'E') {
              score_total = score_total + parseInt(score[1])
            }
            score_count = score_count + 1
            $("#teamscores").append('<div class="row text-center align-items-center"><div class="col-md text-truncate">' + golfer + '</div><div class="col-md">' + score.slice(1) + '</div></div>')
            wrote = true
          }
          if (score_count == 4 && !wrote) {
            $("#teamscores").append('<div class="row text-center align-items-center"><div class="col-md text-truncate"><s>' + golfer + '</s></div><div class="col-md"><s>' + score.slice(1) + '</s></div></div>')
          }
        }
      }
      if (score_total >= 0) {
        if (score_total == 0) {
          score_total = 'E'
        } else {
          score_total = '+' + score_total
        }
      }
      $("#teamscores").append('<div class="row text-center align-items-center"><div class="col-md text-truncate">Total</div><div class="col-md">' + score_total + '</div></div>')
    }

    for (let i = 0; i < 10; i++) {
      golfer = data.events[0].competitions[0].competitors[i].athlete.shortName
      score = data.events[0].competitions[0].competitors[i].score

      $("#leaderboard").append('<div class="row text-center align-items-center", id = "sb_row_' + i + '"><div class="col-md text-truncate">' + golfer + '</div><div class="col-md text-truncate">' + score + '</div></div>')
    }

    for (let i = 0; i < 10; i++) {
      k = i + 10
      golfer = data.events[0].competitions[0].competitors[k].athlete.shortName
      score = data.events[0].competitions[0].competitors[k].score

      id = "#sb_row_" + i
      $(id).append('<div class="col-md text-truncate">' + golfer + '</div><div class="col-md text-truncate">' + score + '</div>')
    }

    for (let i = 0; i < 10; i++) {
      k = i + 20
      golfer = data.events[0].competitions[0].competitors[k].athlete.shortName
      score = data.events[0].competitions[0].competitors[k].score

      id = "#sb_row_" + i
      $(id).append('<div class="col-md text-truncate">' + golfer + '</div><div class="col-md text-truncate">' + score + '</div>')
    }
  })
})