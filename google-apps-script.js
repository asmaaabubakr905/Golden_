/**
 * Google Apps Script Web App - Tour Booking Form Handler
 * 
 * This script handles POST requests from React form and saves data to Google Sheets
 * Supports CORS properly for cross-origin requests
 * 
 * SETUP INSTRUCTIONS:
 * 1. Open Google Sheets and create a new sheet
 * 2. Add headers in row 1: Tour | Name | Phone | Guests | Select Date | Time Submitted
 * 3. Go to Extensions > Apps Script
 * 4. Paste this code
 * 5. Save the project
 * 6. Deploy > New deployment > Web app
 * 7. Execute as: Me
 * 8. Who has access: Anyone (IMPORTANT!)
 * 9. Copy the Web App URL and use it in React
 */

// Replace with your Google Sheet ID
const SHEET_ID = '1MiP4mpGUEpujdAQRLEjnHWQaqNff-63YuIUB-6A8FD0';
const SHEET_NAME = 'Sheet1'; // Change if your sheet has a different name

/**
 * Handle POST request from React form
 * Note: Google Apps Script Web Apps automatically handle CORS when "Who has access" is set to "Anyone"
 * But we still need to set headers explicitly in the response
 */
function doPost(e) {
  try {
    // Parse data from request
    // Google Apps Script receives FormData as e.parameter object
    let requestData;
    
    if (e.parameter) {
      // Data sent as FormData (recommended - no CORS preflight)
      requestData = {
        tour: e.parameter.tour || '',
        name: e.parameter.name || '',
        phone: e.parameter.phone || '',
        guests: e.parameter.guests || '',
        selectDate: e.parameter.selectDate || ''
      };
    } else if (e.postData && e.postData.contents) {
      // Fallback: Data sent as JSON in body
      try {
        requestData = JSON.parse(e.postData.contents);
      } catch (parseError) {
        throw new Error('Failed to parse JSON data');
      }
    } else {
      throw new Error('No data received');
    }

    // Validate required fields
    if (!requestData.tour || !requestData.name || !requestData.phone || !requestData.guests) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'Missing required fields'
      }))
      .setMimeType(ContentService.MimeType.JSON);
    }

    // Open the Google Spreadsheet
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    
    // Try to get sheet by name first, if not found, use the first sheet
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    // If sheet with specified name doesn't exist, use the first sheet
    if (!sheet) {
      const sheets = spreadsheet.getSheets();
      if (sheets.length > 0) {
        sheet = sheets[0]; // Use the first sheet
      } else {
        throw new Error('No sheets found in the spreadsheet.');
      }
    }

    // Get current timestamp
    const timestamp = new Date();
    const formattedTime = Utilities.formatDate(
      timestamp,
      Session.getScriptTimeZone(),
      'yyyy-MM-dd HH:mm:ss'
    );

    // Prepare row data
    const rowData = [
      requestData.tour || '',
      requestData.name || '',
      requestData.phone || '',
      requestData.guests || '',
      requestData.selectDate || '',
      formattedTime
    ];

    // Append data to sheet
    sheet.appendRow(rowData);

    // Return success response with CORS headers
    // Note: When "Who has access" is set to "Anyone", Google Apps Script automatically adds CORS headers
    // But we can also use HtmlService to have more control
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Booking submitted successfully',
      data: {
        tour: requestData.tour,
        name: requestData.name,
        phone: requestData.phone,
        guests: requestData.guests,
        selectDate: requestData.selectDate,
        timestamp: formattedTime
      }
    }))
    .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString(),
      message: 'Failed to submit booking'
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Test function - Run this to verify the script works
 * Make sure to set SHEET_ID first
 */
function testDoPost() {
  const mockEvent = {
    postData: {
      contents: JSON.stringify({
        tour: 'Test Tour',
        name: 'Test User',
        phone: '0123456789',
        guests: '2',
        selectDate: '28 January'
      })
    }
  };
  
  const result = doPost(mockEvent);
  Logger.log(result.getContent());
}

