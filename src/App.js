import Visualizer1 from './components/Visualizer1';
import Visualizer2 from './components/Visualizer2';
import { Row,Col,Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import VisButton from './components/VisButton';
import "./styles/App.css";


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id:-1,
    };
  }

  handleBtnClick = (id) => {
    this.setState({id});
  }
  
  render() {
    return (
      <div className="App">
        <header>
          <h1>Pi Visualizer</h1>
          <h6>A collection of visualizers that simulate the digits of the mathematical constant, Pi (π)!</h6>
        </header>
        <main>
          <br></br>
          <Container id="visbtns" style={{display:this.state.id===-1 ? "block" : "none"}}>
            <h2>Select a visualiztion tool!</h2>
            <Row>
              <Col>
                <VisButton onClick={()=>this.handleBtnClick(0)} title={"Angles"}></VisButton>
              </Col>
              <Col>
                <VisButton onClick={()=>this.handleBtnClick(1)} title={"Number Ball"}></VisButton>
              </Col>
            </Row>
            <Row>
              <Col>
                <VisButton disabled={true} onClick={()=>this.handleBtnClick(2)} title={"Coming Soon!"}></VisButton>
              </Col>
              <Col>
                <VisButton disabled={true} onClick={()=>this.handleBtnClick(3)} title={"Coming Soon!"}></VisButton>
              </Col>
            </Row>
              {/* <Col xl={3} lg={6} md={6} sm={12}>
                <VisButton onClick={()=>this.handleBtnClick(0)} title={"Angles"}></VisButton>
              </Col>
              <Col xl={3} lg={6} md={6} sm={12}>
                <VisButton onClick={()=>this.handleBtnClick(1)} title={"Number Ball"}></VisButton>
              </Col>
              <Col xl={3} lg={6} md={6} sm={12}>
                <VisButton onClick={()=>this.handleBtnClick(2)} title={""}></VisButton>
              </Col>
              <Col xl={3} lg={6} md={6} sm={12}>
                <VisButton onClick={()=>this.handleBtnClick(3)} title={""}></VisButton>
              </Col>
            </Row>
            <Row>
              <Col xl={3} lg={6} md={6} sm={12}>
                <VisButton onClick={()=>this.handleBtnClick(4)} title={""}></VisButton>
              </Col>
              <Col xl={3} lg={6} md={6} sm={12}>
                <VisButton onClick={()=>this.handleBtnClick(5)} title={""}></VisButton>
              </Col>
              <Col xl={3} lg={6} md={6} sm={12}>
                <VisButton onClick={()=>this.handleBtnClick(6)} title={""}></VisButton>
              </Col>
              <Col xl={3} lg={6} md={6} sm={12}>
                <VisButton onClick={()=>this.handleBtnClick(7)} title={""}></VisButton>
              </Col>
            </Row>
            <Row>
              <Col xl={3} lg={6} md={6} sm={12}>
                <VisButton onClick={()=>this.handleBtnClick(8)} title={""}></VisButton>
              </Col>
              <Col xl={3} lg={6} md={6} sm={12}>
                <VisButton onClick={()=>this.handleBtnClick(9)} title={""}></VisButton>
              </Col>
              <Col xl={3} lg={6} md={6} sm={12}>
                <VisButton onClick={()=>this.handleBtnClick(10)} title={""}></VisButton>
              </Col>
              <Col xl={3} lg={6} md={6} sm={12}>
                <VisButton onClick={()=>this.handleBtnClick(11)} title={""}></VisButton>
              </Col>
            </Row>
            <Row>
              <Col xl={3} lg={6} md={6} sm={12}>
                <VisButton onClick={()=>this.handleBtnClick(12)} title={""}></VisButton>
              </Col>
              <Col xl={3} lg={6} md={6} sm={12}>
                <VisButton onClick={()=>this.handleBtnClick(13)} title={""}></VisButton>
              </Col>
              <Col xl={3} lg={6} md={6} sm={12}>
                <VisButton onClick={()=>this.handleBtnClick(14)} title={""}></VisButton>
              </Col>
              <Col xl={3} lg={6} md={6} sm={12}>
                <VisButton onClick={()=>this.handleBtnClick(15)} title={""}></VisButton>
              </Col>
            </Row> */}
          </Container>
          <Container id="vis1" style={{display:this.state.id===0 ? "block" : "none"}}>
            <Visualizer1></Visualizer1>
          </Container>
          <Container id="vis2" style={{display:this.state.id===1 ? "block" : "none"}}>
            <Visualizer2></Visualizer2>
          </Container>
        </main>
        <br></br>
        <footer>
          <p>Made with ❤️ by <a href="github.com/pixelhypercube">pixelhypercube</a></p>
        </footer>
      </div>
    );
  }
}