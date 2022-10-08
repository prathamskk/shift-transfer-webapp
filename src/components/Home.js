import MicRecorder from "mic-recorder-to-mp3";
import React from "react";
import axios from "axios";
import "../styles/homepage.css";
import s1logo from "../images/scic1.svg";

const audioRecorder = new MicRecorder({ bitRate: 128 });

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isblocked: false,
      blobUrl: "",
      isrecording: false,
      audio: "",
    };
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.handleaudiofile = this.handleaudiofile.bind(this);
  }
  componentDidUpdate() {
    navigator.getUserMedia(
      { audio: true, video: false },
      () => {
        console.log("Permission Granted");
        this.setState({ isblocked: false });
      },
      () => {
        console.log("Permission Denied");
        this.setState({ isblocked: true });
      }
    );
  }

  start = () => {
    if (this.state.isblocked) {
      console.log("permission Denied");
    } else {
      audioRecorder
        .start()
        .then(() => {
          this.setState({
            isrecording: true,
          });
        })
        .catch((e) => console.log(e));
    }
  };

  stop = () => {
    audioRecorder
      .stop()
      .getMp3()
      .then(([buffer, blob]) => {
        const blobUrl = URL.createObjectURL(blob);
        this.setState({ blobUrl, isrecording: true });
        var d = new Date();
        var file = new File([blob], d.valueOf(), { type: "audio/wav" });
        console.log(file);
        this.handleaudiofile(file);
      })
      .catch((e) => console.log("We could not retrieve your message"));
  };

  handleaudiofile(ev) {
    let file = ev;
    let fileName = ev.name;
    let fileType = ev.type;
    axios
      .post(
        "https://jsfu2dh5ie.execute-api.ap-south-1.amazonaws.com/dev/sign-s3",
        {
          fileName: fileName,
          fileType: fileType,
        }
      )
      .then((response) => {
        var returnData = response.data.data.returnData;
        var signedRequest = returnData.signedRequest;
        var url = returnData.url;
        var options = {
          headers: {
            "Content-Type": fileType,
          },
        };
        axios
          .put(signedRequest, file, options)
          .then((result) => {
            this.setState({ audio: url }, () => console.log(this.state.audio));
            alert("audio uploaded");
          })
          .catch((error) => {
            alert("ERROR " + JSON.stringify(error));
          });
      })
      .catch((error) => {
        alert(JSON.stringify(error));
      });
  }

  render() {
    return (
      <div className="format">
        <button
          onClick={this.start}
          disabled={this.state.isrecording}
          type="button"
        >
          Start
        </button>
        <button onClick={this.stop} type="button">
          Stop
        </button>
        <audio src={this.state.blobUrl} controls="controls" />
        <div className="Main">
        <header className="heading">
          <div className="title"><span className="fi">learn</span><span className="se">SBAR</span></div>
          <div className="icon">
            {/* icon */}
            <i className="fa fa-user fa-sm" aria-hidden="true"></i>
          </div>
        </header>
        <div className="info">
        Read how SBAR can ease the
communication transfer
        </div>
        <div className="container">
          <div className="card">
            {/* <div> */}
              <img src={s1logo} class="s1"></img>
            {/* </div> */}
            <div className="sch">
              <h3 className="schead">
                Scenario 1
              </h3>
              <div className="scpara">This scenario describes about the patient’s
sufferings she is currently going through.</div>
            </div>
            <div className="gitem layout">Pass</div>
          </div>
          <div className="card">
            {/* <div> */}
              <img src={s1logo} class="s1"></img>
            {/* </div> */}
            <div className="sch">
              <h3 className="schead">
                Scenario 2
              </h3>
              <div className="scpara">.</div>
            </div>
            <div className="gitem layout">Pass</div>
          </div>
          <div className="card">
            {/* <div> */}
              <img src={s1logo} class="s1"></img>
            {/* </div> */}
            <div className="sch">
              <h3 className="schead">
                Scenario 3
              </h3>
              <div className="scpara">.</div>
            </div>
            <div className="gitem layout">Pass</div>
          </div>
          <div className="card">
            {/* <div> */}
              <img src={s1logo} class="s1"></img>
            {/* </div> */}
            <div className="sch">
              <h3 className="schead">
                Scenario 4
              </h3>
              <div className="scpara">.</div>
            </div>
            <div className="gitem layout">Pass</div>
          </div>

        </div>
        </div>
      </div>
    );
  }
}

export default Home;
