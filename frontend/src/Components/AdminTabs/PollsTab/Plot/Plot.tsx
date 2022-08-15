import { PureComponent, useEffect, useState } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LabelList } from 'recharts';
import ReactWordCloud, { Callbacks, Options, Word } from 'react-wordcloud';
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";

import { IPollCompact } from '../../../../Interfaces/IPoll';
import { IVote } from '../../../../Interfaces/IVote';

import './Plot.css';

type PlotElement = {
  text: string,
  value: number,
}

type PlotData = PlotElement[];

type VotesObj = {
  [key: string]: number;
}

type componentProps = {
  poll: IPollCompact,
}

const PlotComponent = ({ poll }: componentProps) => {

  const [plotData, setPlotData] = useState<PlotData>([]);
  const [maxVote, setMaxVote] = useState<number>(0);
  const [plotType, setPlotType] = useState<string>('bar');

  const plotTypes = {
    bar: plotType === 'bar',
    pie: plotType === 'pie',
    radar: plotType === 'radar',
    wordCloud: plotType === 'wordCloud',
  }

  useEffect(() => {
    const newPlotData = processData(poll.type, poll.votes);
    const maxVote = getMaxVote(newPlotData);
    setPlotData(newPlotData);
    setMaxVote(maxVote);
  }, [poll]);

  const optionsLength = poll.options.length || poll.votes.length || 5;
  const colours = ["#71caeb", "#ed6b6a", "#90c78f", "#edb458", "#a78bc0", "#8b1e3f", "#04724d", "#f2d0a9", "#d62839", "#4281a4"];

  const processData = (voteType: string, votes: IVote[]): PlotData => {
    if (voteType === 'rating') {
      const votesObject = votes.reduce((acc: VotesObj, curr: IVote) => {
        acc[curr.option!] = acc[curr.option!] + curr.user.vpoints;
        return acc;
      }, { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 });

      const dataArray = Object.entries(votesObject).map(el => ({ text: el[0] + ' star', value: el[1] }));
      return dataArray;

    } else if (voteType === 'multiple choice') {
      const optionsAcc = Object.fromEntries(poll.options.map(el => [el, 0]));
      const votesObject = votes.reduce((acc: VotesObj, curr: IVote) => {
        acc[curr.option!] = acc[curr.option!] + curr.user.vpoints;
        return acc;
      }, optionsAcc);

      const dataArray = Object.entries(votesObject).map(el => ({ text: el[0], value: el[1] }));
      return dataArray;
    } else if (voteType === 'open answer') {
      const votesObject = votes.reduce((acc: VotesObj, curr: IVote) => {
        acc[curr.option!] = acc[curr.option!] ? acc[curr.option!] + 1 : 1;
        return acc;
      }, {});

      const dataArray = Object.entries(votesObject).map(el => ({ text: el[0], value: el[1] }));
      return dataArray;
    } else {
      return [] as PlotData;
    }
  }

  const getMaxVote = (data: PlotData): number => {
    return Math.max(...data.map(el => el.value));
  }

  const onChangePlotType = (ev: any) => {
    setPlotType(ev.target.value);
  }

  //WordCloud options

  const callbacks: Callbacks = {
    getWordTooltip: (word: Word) => `${word.text}  got ${word.value} votes`,
  }

  const options: Options = {
    colors: colours,
    enableTooltip: true,
    deterministic: false,
    fontFamily: "impact",
    fontStyle: "italic",
    fontSizes: [32, 96],
    fontWeight: "900",
    padding: 1,
    rotations: 3,
    rotationAngles: [0, 0],
    scale: 'sqrt',
    spiral: "archimedean",
    transitionDuration: 1000,
    enableOptimizations: true,
    svgAttributes: {},
    textAttributes: {},
    tooltipOptions: {
      followCursor: true,
      offset: [10, 10],
    },
  };

  return (
    <div className="chartWrapper">
      <div className="chartTypeSelector">
        <h3>Plot Results for poll "{poll.title}"" in event "{poll.event.title}"</h3>
        <p>Choose plot type: </p>
        <div onChange={onChangePlotType}>
          <input type="radio" value="bar" name="plotType" readOnly checked={plotType === "bar"} /> Bar Chart
          <input type="radio" value="pie" name="plotType" readOnly checked={plotType === "pie"} /> Pie Chart
          <input type="radio" value="radar" name="plotType" readOnly checked={plotType === "radar"} /> Radar Chart
          <input type="radio" value="wordCloud" name="plotType" readOnly checked={plotType === "wordCloud"} /> Word Cloud
        </div>
      </div>

      {plotTypes.bar &&
        <BarChart width={1200} height={700} data={plotData}>
          <CartesianGrid strokeDasharray="5 1 2" />
          <XAxis dataKey="text" tick={{ fill: "white", fontSize: "1.5rem" }} />
          <YAxis />
          <Tooltip
            contentStyle={{ backgroundColor: "rgba(50, 50, 50, 0.9)", border: "none" }}
            itemStyle={{ color: "white", fontSize: "1rem" }}
            labelStyle={{ color: "white", fontSize: "1rem" }}
            cursor={{ fill: "rgba(107, 107, 107, 0.5)" }}
          />
          <Bar
            dataKey="value"
            maxBarSize={150}
          >
            {plotData.map((entry, index) => <Cell key={`cell-${index}`} fill={colours[index]} />)}
          </Bar>
        </BarChart>
      }

      {plotTypes.pie &&
        <PieChart width={1200} height={700}>
          <Tooltip
            contentStyle={{ backgroundColor: "rgba(50, 50, 50, 0.9)", border: "none" }}
            itemStyle={{ color: "white", fontSize: "1rem" }}
            labelStyle={{ color: "white", fontSize: "1rem" }}
            cursor={{ fill: "rgba(107, 107, 107, 0.5)" }}
          />
          <Legend iconSize={16} iconType="star" />
          <Pie
            data={plotData}
            dataKey="value"
            nameKey="text"
            cx="50%"
            cy="50%"
            outerRadius={300}
            fill="#71caeb"
            legendType="line"
          >
            {plotData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colours[index]} />
            ))}
          </Pie>
        </PieChart>
      }

      {plotTypes.radar &&
        <RadarChart outerRadius={300} width={1200} height={700} data={plotData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="text" tick={{ fill: "white", fontSize: "1.5rem" }} />
          <PolarRadiusAxis
            angle={360 / optionsLength}
            domain={[0, (maxVote + 1)]}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "rgba(50, 50, 50, 0.9)", border: "none" }}
            itemStyle={{ color: "white", fontSize: "1rem" }}
            labelStyle={{ color: "white", fontSize: "1rem" }}
          />
          <Radar name="Votes per option" dataKey="value" stroke="#71caff" fill="#71caeb" fillOpacity={0.6} />
        </RadarChart>
      }

      {plotTypes.wordCloud &&
        <div className="wordCloudWrapper">
          <ReactWordCloud
            words={plotData}
            callbacks={callbacks}
            options={options}
            size={[1200, 700]}
          />
        </div>}
    </div>
  )
}

export default PlotComponent;