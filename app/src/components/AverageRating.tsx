import { useEffect, useState } from "react";
import { useAverageRatingQuery, AverageRating } from "../api";
import {
  LineChart,
  Line,
  YAxis,
  XAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
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

export default function AverageRating() {
  const { data: averageRating } = useAverageRatingQuery();
  const [averageRatingByMonth, setAverageRatingByMonth] = useState([] as any);
  const [filterMonth, setFilterMonth] = useState<string>("");
  const [searchInMonth, setSearchInMonth] = useState([] as any);

  useEffect(() => {
    if (averageRating) {
      let temp = [] as AverageRating[];
      for (const Rating of averageRating) {
        let obj = {
          VendorID: Rating.VendorID,
          Name: Rating.Name,
          AverageRating: Rating.AverageRating,
          Month: Rating.Month,
        };

        temp.push(obj);
      }

      setAverageRatingByMonth(temp);
    }
  }, [averageRating]);

  useEffect(() => {
    if (averageRating) {
      let filteredSearch = [] as AverageRating[];
      for (const obj of averageRating) {
        if (obj.Month === filterMonth) {
          filteredSearch.push(obj);
        }
      }
      setSearchInMonth(filteredSearch);
    }
  }, [filterMonth]);

  console.log(averageRatingByMonth);

  return (
    <>
      <Dropdown
        placeholder="Select Month"
        style={{ width: "20%", marginLeft: "40%", marginTop: "20px" }}
        selection
        options={monthOptions}
        onChange={(_, data) => setFilterMonth(data.value as string)}
      />
      <LineChart
        width={800}
        height={600}
        data={searchInMonth}
        margin={{ top: 50, right: 30, left: 20, bottom: 30 }}
      >
        <text
          x={500 / 2}
          y={20}
          fill="black"
          textAnchor="left"
          dominantBaseline="central"
        >
          <tspan fontSize="20">Average Rating Over Time</tspan>
        </text>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={"Month"} />
        <YAxis
          type={"number"}
          dataKey={"AverageRating"}
          label={{
            value: "Average Rating",
            angle: -90,
            position: "insideLeft",
            textAnchor: "middle",
          }}
        />
        <ZAxis type={"category"} dataKey={"Name"} />

        <Legend verticalAlign="top" />
        <Tooltip cursor={{ stroke: "red", strokeWidth: 2 }} />
        <Line dataKey="AverageRating" stroke="#FF0000" />
        <Line type="monotone" dataKey="Name" stroke="#FF0000" />
      </LineChart>
    </>
  );
}
