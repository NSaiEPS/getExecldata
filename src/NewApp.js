import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function NewApp() {
  const [file, setFile] = useState(null);
  const [columnData, setColumnData] = useState([]);
  const [isComplete, setIsComplete] = useState(false);

  const [requiredData, setRequiredData] = useState([]);
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const fetchDataFromUrls = async () => {
    const updatedColumnData = [];

    for (const url of columnData) {
      try {
        if (url) {
          let SECRET_KEY = "UX8BMIBN";

          let paramQuery = `domain=${url}'&isOrganic=true&r=2&api_key=${SECRET_KEY}`;

          const response = await fetch(
            `https://www.spyfu.com/apis/core_api/get_domain_competitors_us?${paramQuery}`
          );
          const competitorsData = await response.json();
          getData(competitorsData, url);
          console.log(competitorsData, "competitorsData");
        }
      } catch (error) {
        console.error(`Error fetching domain for ${url}:`, error);
        updatedColumnData.push("Error fetching domain");
      }
    }

    console.log("Domain data:", updatedColumnData);
    setIsComplete(true);
  };

  const getData = async (aRows, url) => {
    let SECRET_KEY = "UX8BMIBN";

    if (aRows) {
      let mainDomainData = {};
      let mainSite = aRows[0]["domainName"];
      if (mainSite) {
        let paramQuery = `domain=${mainSite}&api_key=${SECRET_KEY}`;
        const response = await fetch(
          `https://www.spyfu.com/apis/core_api/get_domain_metrics_us?${paramQuery}`
        );
        let mainDomainDatas = await response.text();
        if (mainDomainDatas) {
          mainDomainData = await JSON?.parse(mainDomainDatas);
        }
      }

      let aCometitor = [];
      for (let i = 1; i < aRows.length; i++) {
        let mainSite = aRows[i]["domainName"];

        if (mainSite) {
          let paramQuery = `domain=${mainSite}&api_key=${SECRET_KEY}`;
          const response = await fetch(
            `https://www.spyfu.com/apis/core_api/get_domain_metrics_us?${paramQuery}`
          );

          let competitorDatas = await response.text();
          let competitorData = {};
          if (competitorDatas) {
            competitorData = await JSON?.parse(competitorDatas);
          }

          const competitorObject = {
            competitor_name: mainSite,
            competitor_traffic: competitorData?.organic_clicks_per_month
              ? competitorData?.organic_clicks_per_month
              : 0,
            competitor_organic_keywords: competitorData?.num_organic_keywords
              ? competitorData?.num_organic_keywords
              : 0,
          };

          aCometitor.push(competitorObject);
          console.log(competitorData, "aCometitor");
        }
      }
      console.log(aCometitor, "aCometitor");

      const competitorDataAry = aCometitor.reduce(
        (a, b) => {
          return a?.competitor_traffic > b?.competitor_traffic ? a : b;
        },
        {
          competitor_traffic: 0,
          competitor_organic_keywords: 0,
          competitor_name: "Total",
        }
      );

      console.log(mainDomainData, "aCometitor");

      const aRecords = {
        company_url: url,
        company_traffic: mainDomainData?.organic_clicks_per_month
          ? mainDomainData?.organic_clicks_per_month
          : 0,
        company_organic_keywords: mainDomainData?.num_organic_keywords
          ? mainDomainData?.num_organic_keywords
          : 0,
      };
      const mergedRecords = { ...aRecords, ...competitorDataAry };
      handleData(mergedRecords);
    }
  };
  const handleData = (data) => {
    setRequiredData((prevData) => [...prevData, data]);
  };
  const processData = () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0]; // Assuming you want data from the first sheet
      const worksheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (rows.length > 0) {
        // Extract data from the third column of each row
        const columnData = rows.map((row) => row[3]); // Assuming zero-based indexing
        console.log("Data from third column:", columnData);
        setColumnData(columnData);

        // Fetch domain from each URL
        fetchDataFromUrls();
      } else {
        console.log("File does not contain any data");
      }
    };

    reader.readAsArrayBuffer(file);
  };
  console.log(requiredData, "requiredData");

  const convertToCSV = () => {
    const csvRows = [];
    // Assuming data is an array of objects
    const headers = Object.keys(requiredData[0]);
    csvRows.push(headers.join(","));

    for (const row of requiredData) {
      const values = headers.map((header) => {
        const value = row[header] !== null ? row[header] : "_";
        const escaped = ("" + value).replace(/"/g, '\\"');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(","));
    }

    return csvRows.join("\n");
  };

  const handleDownload = () => {
    const csvData = convertToCSV();
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "sampleData.csv");
  };
  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={processData}>Process Data</button>
      {isComplete && <button onClick={handleDownload}>Download</button>}
    </div>
  );
}

export default NewApp;
