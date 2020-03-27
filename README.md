# [CoronaVirusTracker live link](http://covid19trackerapp.com/)

## Background

Coronavirus dominates news cycles around the world, with varying levels of concern from utter hysteria to total indifference.  The goal of this project, *Coronavirus Tracker*, is to provide a data-centric, interactive overview of the coronavirus spread to counter narratives that are not based in fact/numbers.

## Data Source

A challenge given the extremely fluid global situation surrounding coronavirus (not to mention the possibility that some government reporting agencies may not be completely truthful in their statistics reporting), is finding a trustworthy data source that is frequently updated and acceessible (for free) via API.  Luckily, researchers at Johns Hopkins University and elsewhere have quickly created exactly that!  Note: if you are aware of other or better API sources for similar information, please get in contact with me.  

  * [example table here](https://github.com/CSSEGISandData/COVID-19/blob/master/csse_covid_19_data/csse_covid_19_daily_reports/02-25-2020.csv)


## Existing Similar Solutions

There are some existing sites that serve a similar function, listed below.  However, none of the websites that I found provide a robust data interactivity capability that might be useful to a user asking questions like: "are there reported cases near my home city/state/country?".  Nor do they provide some kind of alert mechanism for if confirmed cases are reported near their location.  Coronavirus Tracker aims to address these two questions.

Existing/similar Solutions:
  * [Johns Hopkins University Coronavirus dashboard](https://gisanddata.maps.arcgis.com/apps/opsdashboard/index.html#/bda7594740fd40299423467b48e9ecf6)
  * [visalist.io Map](https://visalist.io/emergency/coronavirus)
  * [World Health Organization (WHO) interactive map](https://experience.arcgis.com/experience/685d0ace521648f8a5beeeee1b9125cd)
  * [World o Meter.com](https://www.worldometers.info/coronavirus/)
  
  
 ## Functionality and MVP
   * Present Johns Hopkins CSV files data using D3.js
     
   * Filter by:
     * Country - bar graph/calendar of cases and recoveries over time
     * Province/State - bar graph/calendar graph of cases and recoveries over time
     
   
 ## Preview
 
   * Country-Specific Preview
 ![](mockups/gif_preview/country_preview.gif)
 
 
 ## Architecture and Technologies
   * [D3.js](https://github.com/d3/d3/wiki)
 
 ## Will Possibly Add:
  * Calendar view - gives a new visual to understand trends over time, [example](https://observablehq.com/@d3/calendar-view) 
  * Testing data by state in the US using: https://covidtracking.com/api/
  * Sign up your email to get sent when a confirmed case is reported near you
  * Self-diagnosis step by step walkthrough that ends suggesting a specific action, ie "go to the ER", "continue to look for X symptom over the next 7 days", "no need to worry!"
 
 
