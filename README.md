vb-incidents
============

### A utility for pulling data from Virginia Beach ePro app of police incidents. Then use that data for testing new ways to display or search.

What this Node.js App Does (or will do when working)
===================================================
 * Pulls VB incident data for a range of dates
 * Converts from SOAP (XML) to JSON
 * Imports into a local mongodb for you to hack against
 * Data samples included in root of repo
 * Assuming you have Node.js installed, run `npm install` to add modules, then run with `node app.js`

Existing VB Incidents Data
==========================
 * Web GUI: https://wwws.vbgov.com/ePRO/MainUI/Incidents/IncidentSearch.aspx
 * API endpoint: https://public.vbgov.com/Secure/service.asmx?op=GetIncidentData
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
 * Data only goes back to 1/1/2011.

Using the Returned Data, From SOAP to JSON
=========================================
 * step-0: data is returned in HTML-encoded XML inside a SOAP wrapper.
 * step-1: SOAP wrapper has been removed, XML is still HTML-encoded.
 * step-2: post de-encoding of HTML characters (angle brackets, etc.)
 * step-3: post XML2JSON 
 * step-4: outer JSON doc removed, leaving a document for each incident, ready for import into mongodb, etc.
 
