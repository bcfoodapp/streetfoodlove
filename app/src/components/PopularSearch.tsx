import React, { useEffect, useState } from "react";
import { usePopularSearchQuery, PopularSearch } from "../api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Label } from "recharts";
import { Dropdown } from "semantic-ui-react";

const monthOptions = [
  {
    key: "1",
    text: "January",
    value: "January",
  },
  {
    key: "2",
    text: "February",
    value: "February",
  },
  {
    key: "3",
    text: "March",
    value: "March",
  },
  {
    key: "4",
    text: "April",
    value: "April",
  },
  {
    key: "5",
    text: "May",
    value: "May",
  },
  {
    key: "6",
    text: "June",
    value: "June",
  },
  {
    key: "7",
    text: "July",
    value: "July",
  },
  {
    key: "8",
    text: "August",
    value: "August",
  },
  {
    key: "9",
    text: "September",
    value: "September",
  },
  {
    key: "10",
    text: "October",
    value: "October",
  },
  {
    key: "11",
    text: "November",
    value: "November",
  },
  {
    key: "12",
    text: "December",
    value: "December",
  },
];

export default function PopularSearchComponent() {
  const { data: popularSearch } = usePopularSearchQuery();
  const [searchInMonth, setSearchInMonth] = useState([] as any);
  const [filterMonth, setFilterMonth] = useState<string>("");

  useEffect(() => {
    if (popularSearch) {
      let temp = [] as PopularSearch[];
      for (const SearchMonth of popularSearch) {
        console.log(typeof SearchMonth.Month);
        console.log(SearchMonth.Month);
        let obj = {
          QueryText: SearchMonth.QueryText,
          Month: SearchMonth.Month,
          TotalSearch: SearchMonth.TotalSearch,
        };

        temp.push(obj);
      }
      setSearchInMonth(temp);
    }
  }, [popularSearch]);

  useEffect(() => {
    if (popularSearch) {
      let filteredSearch = [] as PopularSearch[];
      for (const obj of popularSearch) {
        let temp = "";
        temp += obj.Month;
        let dateSplit = temp.split("-");
        let monthIndex = parseInt(dateSplit[1], 10) - 1;

        if (monthOptions[monthIndex].text === filterMonth) {
          filteredSearch.push(obj);
        }
      }
      setSearchInMonth(filteredSearch);
    }
  }, [filterMonth]);

  return (
    <>
      <Dropdown
        placeholder="Select Month"
        style={{ width: "20%", marginLeft: "40%", marginTop: "20px" }}
        selection
        options={monthOptions}
        onChange={(_, data) => setFilterMonth(data.value as string)}
      />
      <BarChart
        width={600}
        height={380}
        data={searchInMonth}
        layout={"vertical"}
        margin={{ top: 20, right: 30, left: 30, bottom: 30 }}
      >
        <text
          x={500 / 2}
          y={20}
          fill="black"
          textAnchor="left"
          dominantBaseline="central"
        >
          <tspan fontSize="20">Top 5 Searches in the last Month</tspan>
        </text>
        <XAxis type="number" dataKey="TotalSearch" />

        <YAxis
          hide
          type={"category"}
          label={{
            value: "Searches",
            angle: -90,
            position: "insideLeft",
            textAnchor: "middle",
          }}
        />
        <Tooltip />
        <Legend verticalAlign="bottom" />
        <Bar type={"category"} dataKey={"QueryText"} />
        <Bar type={"number"} dataKey={"TotalSearch"} fill="#FF4782" />
      </BarChart>
    </>
  );
}
