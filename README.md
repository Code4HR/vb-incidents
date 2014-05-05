vb-incidents
============

### A utility for pulling data from Virginia Beach ePro app of police incidents. Then use that data for testing new ways to display or search.

What this Node.js App Does
===================================================
 * Pulls VB incident data for a range of dates (start date to yesterday).
	* Converts data from SOAP (XML) to JSON.
	* Imports into a local mongodb for you to hack against.
 * Eventually will let you view crime data, maps, charts, etc. with your browser (still very much a work in progress).

Setup
===================================================
 * Install mongodb.
 * Install node.js.
 * Run `npm install` to add required node.js modules.
 * Run `node service.js` to populate the local mongodb collection.
	
Viewing Crime Data
===================================================
  * Startup your local mongodb.
  * Run `node app.js`, fire up your browser and go to http://localhost:1337/.
	
Existing VB Incidents Data
==========================
 * Web GUI: https://wwws.vbgov.com/ePRO/MainUI/Incidents/IncidentSearch.aspx.
 * API endpoint: https://public.vbgov.com/Secure/service.asmx?op=GetIncidentData.
 * Case Number format: YYYY123456. YYYY represents the year (e.g. 2006) followed by a 6-digit number. Do not include spaces or dashes.
 * In root of this repo is output of a single call to the API, in xml format. 
 * API will only return one days worth of data, in SOAP (XML), and the only search value is date.

Ideas for Use ([more here](https://github.com/c4hrva/vb-incidents/issues?labels=enhancement&page=1&state=open))
=============
 * Charts and stats showing incidents by date, type
 * Maps showing heatmaps by date range, year-over-year, by type, by change
 * Crime prediction (data science)
 * Need a data definition. XML is semi-self-documeting but some fields need more detailed description.

Limitations of API
==================
 * Current API has one method, and it's by *created* date. The API call can only return a full day's worth of incidents, based on their created date.
 * Incidents are often modified after they are created, so there is no way to intelligently return data that has been updated.
 * It may be necessary to cache the data in a local storage mechanism for more flexable searching and data display, but there's no easy way to get any modified data to keep replica in sync with current.  
 * A single query to the API took up to 6 seconds in testing.
 * Data only goes back to 1/1/2012.
 
Limitations of Import Routine
===================================================
 * The import drops the existing collection then repopulates the collection from the API.  This should (probably) be modified to update existing incidents. 
 * There seems to be a limit to how much data can be queued in a single run.  Anything more than 2 years seems to cause an incident null error once the queue starts processing.  So in order to get all data from 2011 to present into mongodb, you have to change the start and end dates and do a couple of runs.
 