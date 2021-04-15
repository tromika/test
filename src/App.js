import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { Navbar, Nav, Card } from "react-bootstrap";
import moment from "moment";
import numeral from "numeral";
import cubejs from "@cubejs-client/core";
import Chart from "./Chart.js";
import { CodeBlock, dracula } from "react-code-blocks";

import cube from "../cubejs/schema/codesandbox.js._";

const language = "js";
const cubejsApi = cubejs(process.env.REACT_APP_CUBEJS_TOKEN, {
  apiUrl: process.env.REACT_APP_API_URL
});
const numberFormatter = (item) => numeral(item).format("0,0");
const dateFormatter = (item) => moment(item).format("MMM YY");

const renderSingleValue = (resultSet, key) => (
  <h1 height={300}>{numberFormatter(resultSet.chartPivot()[0][key])}</h1>
);

class App extends Component {
  render() {
    return (
      <div>
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand href="#home">codesandbox dashboard</Navbar.Brand>
        </Navbar>
        <br />
        <br />
        <Container fluid>
          <Row>
            <Col sm="6">
              <Card>
                <Card.Header>Gitlab Stars dashboard</Card.Header>
                <Card.Body>
                  <blockquote className="blockquote mb-0">
                    <p>
                      It's just quick dashboard for visualize star count of
                      codesandbox client and templates repositories on Github.
                    </p>
                  </blockquote>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <br />
          <Row>
            <Col sm="4">
              <Chart
                cubejsApi={cubejsApi}
                title="Total Stars"
                query={{ measures: ["codesandbox.stars"] }}
                render={(resultSet) =>
                  renderSingleValue(resultSet, "codesandbox.stars")
                }
              />
            </Col>
          </Row>
          <br />
          <br />
          <Row>
            <Col sm="6">
              <Chart
                cubejsApi={cubejsApi}
                title="New Stars Over Time"
                query={{
                  measures: ["codesandbox.stars"],
                  timeDimensions: [
                    {
                      dimension: "codesandbox.date",
                      granularity: "month"
                    }
                  ]
                }}
                render={(resultSet) => (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={resultSet.chartPivot()}>
                      <XAxis dataKey="category" tickFormatter={dateFormatter} />
                      <YAxis tickFormatter={numberFormatter} />
                      <Tooltip labelFormatter={dateFormatter} />
                      <Line
                        type="monotone"
                        dataKey="codesandbox.stars"
                        name="Stars"
                        stroke="rgb(106, 110, 229)"
                        fill="rgba(106, 110, 229, .16)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              />
            </Col>
            <Col sm="6">
              <Chart
                cubejsApi={cubejsApi}
                title="Stars Over time by Github repo"
                query={{
                  measures: ["codesandbox.cumulativeStars"],
                  dimensions: ["codesandbox.repo"],
                  timeDimensions: [
                    {
                      dimension: "codesandbox.date",
                      dateRange: ["2017-05-01", "2021-02-01"],
                      granularity: "month"
                    }
                  ]
                }}
                render={(resultSet) => {
                  return (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={resultSet.chartPivot()}>
                        <XAxis tickFormatter={dateFormatter} dataKey="x" />
                        <YAxis tickFormatter={numberFormatter} />
                        <Line
                          dataKey="codesandbox/codesandbox-client, codesandbox.cumulativeStars"
                          name="codesandbox/codesandbox-client"
                          fill="#7DB3FF"
                          dot={false}
                        />
                        <Line
                          dataKey="codesandbox/codesandbox-templates, codesandbox.cumulativeStars"
                          name="codesandbox/codesandbox-templates"
                          fill="#49457B"
                          dot={false}
                        />
                        <Legend />
                        <Tooltip />
                      </LineChart>
                    </ResponsiveContainer>
                  );
                }}
              />
            </Col>
          </Row>
          <br />
          <br />
          <Row>
            <Col sm="10">
              <Card>
                <Card.Header>Cube.js data schema</Card.Header>
                <Card.Body>
                  <CodeBlock text={cube} language={language} theme={dracula} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
