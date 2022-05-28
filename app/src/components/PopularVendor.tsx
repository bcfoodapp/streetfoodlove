import { useEffect, useState } from "react";
import { usePopularVendorQuery, PopularVendor } from "../api";
import { BarChart, Bar, XAxis, YAxis, ZAxis, Tooltip, Legend } from "recharts";

export default function PopularVendor(this: any) {
  const { data: popularVendor } = usePopularVendorQuery();
  const [vendorByArea, setVendorByArea] = useState([] as any);
  useEffect(() => {
    if (popularVendor) {
      let temp = [] as PopularVendor[];
      for (const Vendor of popularVendor) {
        let obj = {
          TotalRatings: Vendor.TotalRatings,
          BusinessName: Vendor.BusinessName,
          Location: Vendor.Location,
        };

        temp.push(obj);
      }

      setVendorByArea(temp);
    }
  }, [popularVendor]);

  let index;
  return (
    <BarChart
      width={800}
      height={400}
      data={popularVendor}
      layout={"vertical"}
      margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
    >
      <text
        x={500 / 2}
        y={20}
        fill="black"
        textAnchor="left"
        dominantBaseline="left"
        width={200}
      >
        <tspan fontSize="20">
          Top 10 Vendors in Certain Location (by unique review ratings)
        </tspan>
      </text>
      <XAxis type="number" />
      <YAxis
        hide
        type={"category"}
        dataKey={"Location"}
        label={{
          value: "Location",
          angle: -90,
          position: "insideLeft",
          textAnchor: "middle",
        }}
      />
      <Tooltip />
      <Legend />
      <Bar
        dataKey={"TotalRating"}
        label={{ value: "TotalRating", position: "insideRight" }}
        fill="#FF6347"
      />
      <Bar
        dataKey={"BusinessName"}
        label={{ value: "BusinessName", position: "insideTopLeft" }}
        fill="#FF4782"
      />
    </BarChart>
  );
}
