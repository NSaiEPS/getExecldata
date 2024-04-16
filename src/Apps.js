import React, { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Button, Spin } from "antd";
import { PoweroffOutlined } from "@ant-design/icons";
import { InboxOutlined } from "@ant-design/icons";
import Dragger from "antd/es/upload/Dragger";
import drag from "./icons8-drag-and-drop-100.png";
function App() {
  const [file, setFile] = useState(null);
  const [filenamae, setFileName] = useState("");
  const [columnData, setColumnData] = useState([]);
  const [isComplete, setIsComplete] = useState(0);

  const [requiredData, setRequiredData] = useState([]);
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile ? selectedFile.name : "");
  };

  const fetchDataFromUrls = async () => {
    const fetchPromises = columnData.map((url) => getDataFromUrl(url));

    await Promise.all(fetchPromises);

    setTimeout(() => {
      setIsComplete((data) => data + 1);
    }, 5000);
  };

  const getDataFromUrl = async (url) => {
    try {
      if (url) {
        let SECRET_KEY = "UX8BMIBN";

        let paramQuery = `domain=${url}&isOrganic=true&r=2&api_key=${SECRET_KEY}`;

        const response = await fetch(
          `https://www.spyfu.com/apis/core_api/get_domain_competitors_us?${paramQuery}`
        );
        const competitorsData = await response.json();
        getData(competitorsData, url);
        console.log(competitorsData, "competitorsData");
      }
    } catch (error) {
      console.error(`Error fetching domain for ${url}:`, error);
    }
  };

  const getData = async (aRows, url) => {
    let SECRET_KEY = "UX8BMIBN";

    if (aRows) {
      let mainDomainData = {};
      let mainSite = aRows[0]?.domainName;
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
        let mainSite = aRows[i]?.domainName;

        if (mainSite) {
          let paramQuery = `domain=${mainSite}&api_key=${SECRET_KEY}`;
          const response = await fetch(
            `https://www.spyfu.com/apis/core_api/get_domain_metrics_us?${paramQuery}`
          );

          let competitorDatas = await response.text();
          console.log(competitorDatas, "competitorDatas");
          let competitorData = {};
          if (competitorDatas) {
            competitorData = await JSON?.parse(competitorDatas);
          }
          if (
            competitorData.organic_domain_ranking ||
            competitorData.organic_domain_ranking === 0
          ) {
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
            competitorData = {};
            console.log(competitorData, "aCometitor");
          }
        }
      }
      console.log(aCometitor, "aCometitor");

      const competitorDataAry = {
        competitor_traffic: aCometitor[0]?.competitor_traffic
          ? aCometitor[0]?.competitor_traffic
          : 0,
        competitor_organic_keywords: aCometitor[0]?.competitor_organic_keywords
          ? aCometitor[0]?.competitor_organic_keywords
          : 0,
        competitor_name: aCometitor[0]?.competitor_name
          ? aCometitor[0]?.competitor_name
          : mainSite,
      };

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
    setIsComplete(1);
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      //   setFileName(worksheet);
      const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (rows.length > 0) {
        const columnData = rows.map((row, index) => {
          if (index) {
            return row[3];
          }
        });
        console.log("Data from third column:", columnData);
        setColumnData(columnData);

        // fetchDataFromUrls();
      } else {
        console.log("File does not contain any data");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  useEffect(() => {
    if (columnData.length) {
      fetchDataFromUrls();
    }
  }, [columnData]);
  console.log(requiredData, "requiredData");

  const convertToCSV = () => {
    const csvRows = [];
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

  const props = {
    name: "file",
    multiple: true,
    action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
    onChange(info) {
      const { status } = info.file;
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };
  const inputRef = useRef(null);
  return (
    <>
      {
        <div
          style={{
            marginTop: "12px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              width: "500px",
              border: "1.5px solid #E8E8E8",
              padding: "20px",
              //   margin: "5px 5px",
              borderRadius: "4px",
              backgroundColor: "#FFFFFF",
            }}
          >
            <span style={{ color: "#c8c8c8", fontWeight: 600 }}>
              File Upload Preview{" "}
            </span>
            {/* <Dragger
              onChange={(info) => handleFileChange(info.file)}
              onDrop={(e) => handleFileChange(e.dataTransfer.files)}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                <span>
                  Drag and drop or{" "}
                  <span className="file-link">Choose your files</span>
                </span>
              </p> */}
            {/* <p className="ant-upload-hint">
                Support for a single or bulk upload. Strictly prohibited from
                uploading company data 
              </p> */}
            {/* </Dragger> */}
            <div
              style={{
                width: "424px",
                padding: "36px",
                border: "1px dashed black",
                marginTop: "4px",
                backgroundColor: "#eaecf1",
              }}
            >
              <input
                type="file"
                style={{ opacity: 0 }}
                name={"filenamae"}
                ref={inputRef}
                onChange={handleFileChange}
                //   placeholder="hio"
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={() => inputRef.current.click()}
              >
                <img src={drag} alt="" width={50} height={50} />
              </div>
              <p
                onClick={() => inputRef.current.click()}
                style={{
                  textAlign: "center",
                  textDecoration: "underline",
                  color: "#475e7b",
                  cursor: "pointer",
                }}
              >
                <span>{filenamae ? filenamae : "Choose Your File"}</span>
              </p>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              //   justifyContent: "start",
              marginTop: "12px",
            }}
          >
            <button
              style={{
                width: "150px",
                padding: "12px",
                backgroundColor: `${isComplete === 1 ? "#c8c8c8" : "blue"}`,
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: `${isComplete === 1 ? "none" : "pointer"}`,
              }}
              //   disabled={isComplete === 1 ? true : false}
              onClick={() => {
                if (isComplete !== 1) {
                  processData();
                }
              }}
            >
              Process Data
            </button>

            {isComplete === 2 ? (
              <button
                onClick={handleDownload}
                style={{
                  width: "150px",
                  padding: "12px",
                  backgroundColor: "blue",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  marginLeft: "5px",
                  cursor: "pointer",
                }}
              >
                Download
              </button>
            ) : null}
          </div>
          {/* <Button type="primary" icon={<PoweroffOutlined />} loading={true} /> */}
        </div>
      }
      {isComplete === 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "10%",
          }}
        >
          <Spin />
        </div>
      )}
    </>
  );
}

export default App;
