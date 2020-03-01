$(document).ready(function() {
  // pulls initial data unfiltered
  $.ajax({
    url: "https://learn.accountingcpd.net/ACPD/API/Test/SampleObject",
    success: function(result) {
      $.each(result, function() {
        // pulls all courses
        buildCourseTile(this);
      });
    }
  });
});

function filterCourses(filter) {
  // looks to see which course filter is selected, then calls getCourses()

  $(".tablinks").each(function() {
    if ($(this).hasClass("selected")) {
      criteria = $(this).attr("data-course");
    }
  });
  console.log("criteria is..." + criteria);
  getCourses(criteria, filter);
}

function getCourses(criteria, filter) {
  // gets json data, builds objects to html if meets criteria
  //passing in filter variable then sorts the resulting data

  $("#courseList").css("opacity", "0");
  setTimeout(function() {
    $("#courseList").html("");
    $.ajax({
      url: "https://learn.accountingcpd.net/ACPD/API/Test/SampleObject",
      success: function(result) {
        result.sort(sortByProperty(filter));

        $.each(result, function() {
          switch (criteria) {
            case "":
              buildCourseTile(this);
              break;

            default:
              if (this.type == criteria) {
                // pulls only courses matching criteria
                buildCourseTile(this);
              } else {
                var courseTile = "";
              }
          } // end of switch

          $("#courseList").append(courseTile);
          $("#courseList").css("opacity", "1");
        });
      }
    }); // end of ajax
  }, 1000);
}

function buildCourseTile(course) {
  //joins json data per item into a html element
  var courseTile2 =
    "<div class='courseTile " +
    course.type +
    "'><div class='subjectImage' alt='" +
    course.altText +
    "'><div class='subjectTag " +
    course.type +
    "'></div></div><div class='tileInfo'><h3>" +
    course.title +
    "</h3><p>" +
    course.description +
    "</p><p><strong>Price:</strong>" +
    course.price +
    "</p></div></div>";
  $("#courseList").append(courseTile2);
  hideTiles();
  var tileCount = $(".courseTile").length;
  if (tileCount < 10) {
    $(".loadMore").css("display", "none");
  } else {
  }
}

function showMoreTiles() {
  //used to unhide more courses in course list
  var hiddenCount = $(".hidden").length;
  if (hiddenCount < 1) {
    $(".loadMore").css("display", "none");
  }
  var hiddenArray = $(".hidden").toArray();
  for (i = 0; i < 10; i++) {
    $(hiddenArray[i]).removeClass("hidden");
    hiddenCount--;
    if (hiddenCount < 1) {
      $(".loadMore").css("display", "none");
    }
  }
}
function hideTiles() {
  // adds 'hidden' class to items in course list if over 10 items
  $(".LoadMoreContainer").remove();
  var tileCount = $(".courseTile").length;
  var tileArray = $(".courseTile").toArray();
  for (x = tileCount; x > 9; x--) {
    $(tileArray[x]).addClass("hidden");
  }
  $("#courseList").append(loadMoreButton);
}

var loadMoreButton =
  "<div class='LoadMoreContainer'><div class='button loadMore' onclick='showMoreTiles()' style='display: block;'>Load more</div></div>";

var sortByProperty = function(property) {
  //used to re-order json data in list based on property
  return function(x, y) {
    return x[property] === y[property] ? 0 : x[property] > y[property] ? 1 : -1;
  };
};
