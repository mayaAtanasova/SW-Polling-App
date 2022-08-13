import { PureComponent, useEffect, useState } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LabelList } from 'recharts';
import { IPollCompact } from '../../../../Interfaces/IPoll';
import { IVote } from '../../../../Interfaces/IVote';
import './Plot.css';

type PlotData = {
  name: string,
  vote: number,
}[];

type VotesObj = {
  [key: string]: number;
}

type componentProps = {
  poll: IPollCompact,
}

const PlotComponent = ({ poll }: componentProps) => {

  const [plotData, setPlotData] = useState<PlotData>([]);
  const [plotType, setPlotType] = useState<string>('bar');

  const plotTypes = {
    bar: plotType === 'bar',
    pie: plotType === 'pie',
    radar: plotType === 'radar',
  }

  useEffect(() => {
    const newPlotData = processData(poll.type, poll.votes);
    console.log(newPlotData);
    setPlotData(newPlotData);
  }, []);

  const processData = (voteType: string, votes: IVote[]): PlotData => {
    if (voteType === 'rating') {
      const votesObject = votes.reduce((acc: VotesObj, curr: IVote) => {
        acc[curr.option!] = acc[curr.option!] + curr.user.vpoints;
        return acc;
      }, { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 });

      const dataArray = Object.entries(votesObject).map(el => ({ name: el[0] + " star", vote: el[1] }));
      return dataArray;

    } else if (voteType === 'multiple choice') {
      const optionsAcc = Object.fromEntries(poll.options.map(el => [el, 0]));
      const votesObject = votes.reduce((acc: VotesObj, curr: IVote) => {
        acc[curr.option!] = acc[curr.option!] + curr.user.vpoints;
        return acc;
      }, optionsAcc);

      const dataArray = Object.entries(votesObject).map(el => ({ name: el[0], vote: el[1] }));
      return dataArray;
      
    } else {
      return [] as PlotData;
    }
  }

  const onChangePlotType = (ev:any) => {
    setPlotType(ev.target.value);
  }

  return (
    <div className="chartWrapper">
      <div className="chartTypeSelector">
        <h1>Plot Results for poll "{poll.title}"" in event "{poll.event.title}"</h1> 
        <p>Choose plot type: </p>
      <div onChange={onChangePlotType}>
        <input type="radio" value="bar" name="plotType" checked={plotType==="bar"} /> Bar Chart
        <input type="radio" value="pie" name="plotType" checked={plotType==="pie"} /> Pie Chart
        <input type="radio" value="radar" name="plotType" checked={plotType==="radar"} /> Radar Chart
      </div>
      </div>

      {plotTypes.bar && 
      <BarChart width={1200} height={700} data={plotData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip contentStyle={{ backgroundColor: "#1b1b1b" }} />
        <Legend />
        <Bar dataKey="vote" fill="#71caeb" />
      </BarChart>
      }

      {plotTypes.pie && 
      <PieChart width={1200} height={700}>
        <Pie data={plotData} dataKey="vote" nameKey="name" cx="50%" cy="50%" outerRadius={300} fill="#71caeb" legendType="line" label />
        <Legend />
      </PieChart>
      }

      {plotTypes.radar &&
      <RadarChart outerRadius={300} width={1200} height={700} data={plotData}>
      <PolarGrid />
      <PolarAngleAxis dataKey="name"/>
      <PolarRadiusAxis angle={18} domain={[0, 15]} />
      <Radar name="Ratings" dataKey="vote" stroke="#71caff" fill="#71caeb" fillOpacity={0.6} />
      <Legend />
    </RadarChart>
}
    </div>
  )
}

export default PlotComponent;