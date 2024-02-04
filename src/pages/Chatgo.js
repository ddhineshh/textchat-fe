import React, {
  useContext,
  useEffect,
  useRef,
  useCallback,
  useState,
} from "react";
import { AppContext } from "../context/appContext";
// import { addNotifications, resetNotifications } from "../features/userSlice";
import {  useSelector} from "react-redux";
import axios from "axios";
import Accordion from "react-bootstrap/Accordion";
import Offcanvas from "react-bootstrap/Offcanvas";
import { Button } from "react-bootstrap";
import { useLogoutUserMutation } from "../services/appApi";
// import { Button, Col, Form, Row } from "react-bootstrap";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import Welcome from '../components/Welcome'
import companyLogo from '../assets/chat-Go-logo-78.png'
import "../styles/Chatgo.css";

// import NavDropdown from 'react-bootstrap/NavDropdown';



const Chatgo = () => {
  const messageEndRef = useRef(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [message, setMessage] = useState("");
  const [roomName, setRoomName] = useState("");
  const user = useSelector((state) => state.user);
  // const dispatch = useDispatch();
  const {
    socket,
    setMembers,
    members,
    setCurrentRoom,
    setRooms,
    privateMemberMsg,
    rooms,
    setPrivateMemberMsg,
    currentRoom,
    setMessages,
    messages,
  } = useContext(AppContext);

  // logout
  const [logoutUser] = useLogoutUserMutation();

  async function handleLogout(e) {
    e.preventDefault();
    await logoutUser(user);
    // redirect to home page
    window.location.replace("/");
  }

  // create room
  const handleSubmitRooms = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://chat-be-7sbj.onrender.com/create/rooms", {
        name: roomName,
      });
      console.log(response.data);
      // Add new room to state
      setRooms((prevRooms) => [...prevRooms, response.data.name]);
      // Reset form
      setRoomName("");
      setSuccessMessage("Discard Group has been successfully Created!");

      // Hide success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 2000);
    } catch (e) {
      console.log(e);
    }
  };

  function joinRoom(room, isPublic = true) {
    // console.log("joinRoom called with room:", room, "and isPublic:", isPublic);
    if (!user) {
      return alert("Please login");
    }
    socket.emit("join-room", room, currentRoom);
    setCurrentRoom(room);

    if (isPublic) {
      setPrivateMemberMsg(null);
    }
    // dispatch for notifications
    //dispatch(resetNotifications(room));
    scrollToBottom();
  }

  // socket.off("notifications").on("notifications", (room) => {
  //   if (currentRoom !== room) dispatch(addNotifications(room));
  // });

  const fetchRooms = useCallback(async () => {
    try {
      const response = await fetch("https://chat-be-7sbj.onrender.com/create/rooms");
      const rooms = await response.json();
      setRooms(rooms);
    } catch (error) {
      console.log(error);
    }
  }, [setRooms]);

  useEffect(() => {
    if (user) {
      setCurrentRoom(null);
      fetchRooms();
      socket.emit("new-user");
    }
  }, [user, setCurrentRoom, fetchRooms, socket]);

  socket.off("new-user").on("new-user", (payload) => {
    setMembers(payload);
  });

  function orderIds(id1, id2) {
    if (id1 > id2) {
      return id1 + "-" + id2;
    } else {
      return id2 + "-" + id1;
    }
  }

  function handlePrivateMemberMsg(member) {
    scrollToBottom();
    setPrivateMemberMsg(member);
    const roomId = orderIds(user._id, member._id);
    joinRoom(roomId, false);
  }

  
  if (!user) {
    return <></>;
  }

  //   sidebar end functions

  function getFormattedDate() {
    const date = new Date();
    const year = date.getFullYear();
    let month = (1 + date.getMonth()).toString();

    month = month.length > 1 ? month : "0" + month;
    let day = date.getDate().toString();

    day = day.length > 1 ? day : "0" + day;

    return month + "/" + day + "/" + year;
  }

  function scrollToBottom() {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  const todayDate = getFormattedDate();

  socket.off("room-messages").on("room-messages", (roomMessages) => {
    setMessages(roomMessages);
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (!message) return;
    const today = new Date();
    const minutes =
      today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
    const time = today.getHours() + ":" + minutes;
    const roomId = currentRoom;
    socket.emit("message-room", roomId, message, user, time, todayDate);
    setMessage("");
    scrollToBottom();
  }

  const popover = (
    <Popover id="popover-basic">
      <Popover.Header as="h3" className="bg-warning fw-bold">
        Profile
      </Popover.Header>
      <Popover.Body>
        <div className="d-flex align-items-center gap-2">
          <img
            src={user.picture}
            alt="altImg"
            style={{ width: "30px", marginTop: "-10px" }}
          />
          <p className="fs-5 fw-bold ">{user.name}</p>
        </div>
        <p>
          About:{" "}
          <span className="fw-bold">
            "Chat, call, share - all in one app, with {user.name}"
          </span>
        </p>
        <p>+91:12345-67890</p>
        <Button onClick={handleLogout} className="bg-dark border-0">
          Logout
        </Button>
      </Popover.Body>
    </Popover>
  );

  const popover2 = (
    <Popover id="popover-basic">
      <Popover.Header as="h3" className="bg-warning fw-bold">
        Discard Group Details
      </Popover.Header>
      <Popover.Body>
        <div className="d-flex align-items-center gap-2">
          <img
            src="https://cdn6.aptoide.com/imgs/1/2/2/1221bc0bdd2354b42b293317ff2adbcf_icon.png"
            alt="altImg"
            style={{ width: "30px", marginTop: "-10px" }}
          />
          <p className="fs-5 fw-bold">
            {!privateMemberMsg ? currentRoom : privateMemberMsg}
          </p>
        </div>
        {/* <p className="text-end">Created at: {createdAt && createdAt.toLocaleString()}</p> */}
        <p className="text-end px-1">
          Description:{" "}
          <span className="fw-bold">
            "Join the conversation, with {currentRoom}
          </span>
        </p>
        <p className="text-end px-2">
          Discard type: <span className="fw-bold">Public</span>
        </p>

        <p className="text-end px-2">
          Notifications: <span className="fw-bold">on</span>
        </p>
        <div className="d-flex flex-wrap align-items-center justify-content-end">
          {" "}
          Participants:
          {members.map((member, idx) => (
            <p key={idx} className="bg-dark text-light p-1 m-2">
              {member.name}
            </p>
          ))}
        </div>
      </Popover.Body>
    </Popover>
  );

  const popover3 = (
    <Popover id="popover-basic">
      <Popover.Header as="h3" className="bg-warning fw-bold">
        Account Details
      </Popover.Header>
      <Popover.Body>
        <div className="d-flex align-items-center gap-2">
          {privateMemberMsg?.picture && (
            <img
              src={privateMemberMsg.picture}
              alt="altImg"
              style={{ width: "30px", marginTop: "-10px" }}
            />
          )}
          {privateMemberMsg?.name && (
            <p className="fs-5 fw-bold ">{privateMemberMsg.name}</p>
          )}
        </div>
        {privateMemberMsg?.name && (
          <p className="text-end px-2">
            About:{" "}
            <span className="fw-bold">
              "Chat, call, share - all in one app, with {privateMemberMsg.name}"
            </span>
          </p>
        )}
        <p className="text-end px-2">
          phone no: <span className="fw-bold">+91 1234567890</span>
        </p>
        <p className="text-end px-2">
          Notifications: <span className="fw-bold">on</span>
        </p>
        <div className="d-flex flex-wrap align-items-center justify-content-end">
          {" "}
          Groups:
          {rooms.map((rooms, idx) => (
            <p key={idx} className="bg-dark text-light p-1 m-2">
              {rooms}
            </p>
          ))}
        </div>
      </Popover.Body>
    </Popover>
  );

  const popoverForm = (
    <Popover id="popover-basic">
      <Popover.Header as="h3" className="bg-warning fw-bold">
        Create Group
      </Popover.Header>
      <Popover.Body>
        {successMessage && <p className="text-success p-2">{successMessage}</p>}
        <form onSubmit={handleSubmitRooms} className="d-flex flex-column gap-3">
          <label htmlFor="room-name-input">Group Name:</label>
          <input
            type="text"
            id="room-name-input"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="canvas-input"
          />

          <Button type="submit" className="bg-dark border-0">
            create
          </Button>
        </form>
      </Popover.Body>
    </Popover>
  );

  return (
    <>
      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header className="bg-warning" closeButton>
          <Offcanvas.Title className="fw-bold  w-100">Settings</Offcanvas.Title>
        </Offcanvas.Header>

        <h5 className="mt-3 px-3 mb-0 fw-bold text-secondary">
          <i className="fa-solid fa-message"></i> General
        </h5>

        <h5 className="mt-4 px-3 mb-0 fw-bold">
          Login{" "}
          <span className="bg-success px-4 py-1 mx-3 text-center text-light rounded-3">
            on <i className="fa-solid fa-check"></i>{" "}
          </span>
        </h5>
        <hr />
        <h6 className="mx-3 m-0 p-0 text-danger">
          your account will be logout here!
        </h6>
        <Button
          className="bg-dark border-0  w-25 mx-3 mt-2"
          onClick={handleLogout}
        >
          Logout
        </Button>
        <hr />  
        <h5 className="mt-2 px-3 mb-0 fw-bold text-secondary">
          <i className="fa-brands fa-discord"></i> Discard Groups
          <span className="bg-success px-4 py-1 mx-4 text-center text-light rounded-3">
            on <i className="fa-solid fa-check"></i>{" "}
          </span>
        </h5>
        <hr />
        <h5 className="px-3 mb-0 fw-bold text-secondary">
          <i className="fa-sharp fa-solid fa-circle-info"></i> Help center
        </h5>
        <Offcanvas.Body>
          <>
            <Accordion defaultActiveKey="20">
              <Accordion.Item eventKey="0">
                <Accordion.Header>connection issues:</Accordion.Header>
                <Accordion.Body>
                  <ul>
                    <li>
                      1. Check your internet connection to ensure it is stable.
                    </li>
                    <li>2. Try restarting your device or modem.</li>
                    <li>
                      3. Make sure you have the latest version of the app
                      installed.
                    </li>
                    <li>
                      4. Check for any app updates and install them if
                      available.
                    </li>
                    <li>
                      5. Try switching to a different network, such as Wi-Fi or
                      cellular data.
                    </li>
                  </ul>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>Troubleshooting tips:</Accordion.Header>
                <Accordion.Body>
                  <ul>
                    <li>
                      1. Make sure you are using the latest version of your web
                      browser.
                    </li>
                    <li>
                      2. Check your internet connection to ensure it is stable.
                    </li>
                    <li>
                      3. Disable any browser extensions or plugins that may be
                      interfering with the platform.
                    </li>
                    <li>
                      4. Try accessing the platform from a different device or
                      network to see if the issue is localized to your current
                      setup.
                    </li>
                    <li>5. Clear your browser's cache and cookies</li>
                    <li>6. Restart your device and try again.</li>
                  </ul>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="2">
                <Accordion.Header>Technical issues:</Accordion.Header>
                <Accordion.Body>
                  If you are experiencing technical issues with our platform,
                  such as slow loading times or error messages, please try
                  clearing your browser’s cache and cookies. If the problem
                  persists, please contact our support team for assistance.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="3">
                <Accordion.Header>Messaging issues:</Accordion.Header>
                <Accordion.Body>
                  <ul>
                    <li>1. Make sure you have a stable internet connection.</li>
                    <li>
                      2. Check if the person you are trying to message is
                      online.
                    </li>
                    <li>3. Clear the cache and data of the app.</li>
                    <li>
                      4. Uninstall and reinstall the app if the issue persists.
                    </li>
                    <li>
                      5. Contact the app's support team for further assistance.
                    </li>
                  </ul>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </>
        </Offcanvas.Body>
      </Offcanvas>

      <div className="sidebar-chat">
        <div className="chat-container">

          <div className="leftside">
            <div className="header">

            <img src={companyLogo} alt='chatLogo' className='chat-logo-go m-0 p-0'/>
              <h6 className="fw-bold">Chat<span>Go</span></h6>
             
              <ul className="nav-icons p-0">
              <li className="userImg mt-1">
                <OverlayTrigger
                  trigger="click"
                  placement="right"
                  overlay={popover}
                >
                  <img
                    src={user.picture}
                    alt="altImg"
                    className="cover"
                    style={{ cursor: "pointer" }}
                  />
                </OverlayTrigger>
              </li>
                <OverlayTrigger
                  trigger="click"
                  placement="bottom"
                  overlay={popoverForm}
                >
                  <li className="mt-2">
                    <i className="fa-regular fa-pen-to-square"></i>
                  </li>
                </OverlayTrigger>

                <li className="mt-2">
                  <i className="fa-solid fa-gear" onClick={handleShow}></i>
                </li>
              </ul> 

            </div>
     
            <div className="chatlist">
              {members.map((member, idx) => (
                <div
                  className="block"
                  key={idx}
                  style={{ cursor: "pointer" }}
                  onClick={() => handlePrivateMemberMsg(member)}
                  disabled={member._id === user._id}
                >
                  <div className="imgBox">
                    <img src={member.picture} alt="altImg" className="cover" />
                  </div>
                  <div className="details">
                    <div className="listHead">
                      <h4>
                        {member.name}          
                      </h4>

                      <p
                        className="time px-4"
                        style={{
                          color:
                            member.status === "online" ? "yellowgreen" : "red",
                        }}
                      >
                        {member.status === "offline" ? " offline" : "online"}
                      </p>
                      
                      {member._id === user?._id && (
                          <span className="fw-bold msg-you">message yourself</span>
                        )}
                      {/* <div className="message-p">
                        <b
                          className={`${
                            user.newMessages[orderIds(member._id, user._id)]
                              ? "bg-success text-white"
                              : "bg-black badge"
                          }`}
                        >
                          {user.newMessages[orderIds(member._id, user._id)]}
                        </b>
                      </div> */}
                      <div className="d-flex flex-column"></div>
                    </div>
                  </div>
                </div>
              ))}

              {rooms.map((room, idx) => (
                <div className="block" key={idx} onClick={() => joinRoom(room)}>
                  <div className="imgBox">
                    <img
                      src="https://cdn6.aptoide.com/imgs/1/2/2/1221bc0bdd2354b42b293317ff2adbcf_icon.png"
                      alt="altImg"
                      className="cover"
                    />
                  </div>
                  <div className="details d-flex">
                    <div className="listHead">
                      <h4>{room} </h4>
                      <p className="time"></p>
                    </div>
                    {/* <div className="message-p">
                      {currentRoom !== room && (
                        <b
                          className={`${
                            user.newMessages[room]
                              ? "bg-success text-white"
                              : "bg-black badge"
                          }`}
                        >
                          {user.newMessages[room]}
                        </b>
                      )}
                    </div> */}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* chat window */}
          <div className="rightside">
          {user && !currentRoom  ? <Welcome/> : <></>}


            {user && !privateMemberMsg && (
              <>
                <div className="header">
                  <OverlayTrigger
                    trigger="click"
                    placement="right"
                    overlay={popover2}
                  >
                    <div className="imgText" style={{ cursor: "pointer" }}>
                      <div className="userImg border-img">
                        <img
                          src="https://cdn6.aptoide.com/imgs/1/2/2/1221bc0bdd2354b42b293317ff2adbcf_icon.png"
                          alt="altImg"
                          className="cover"
                          style={{ cursor: "pointer" }}
                        />
                      </div>
                      <h5>{currentRoom}</h5>
                    </div>
                  </OverlayTrigger>
                </div>
              </>
            )}

            {user && privateMemberMsg?._id && (
              <>
                <div className="header">
                  <OverlayTrigger
                    trigger="click"
                    placement="right"
                    overlay={popover3}
                  >
                    <div className="imgText" style={{ cursor: "pointer" }}>
                      <div className="userImg border-img">
                        <img
                          src={privateMemberMsg.picture}
                          alt="altImg"
                          className="cover"
                          style={{ cursor: "pointer" }}
                        />
                      </div>
                      <div className="d-flex flex-column align-items-center">
                        <h5 className="mt-4">{privateMemberMsg.name}</h5>

                        <p
                          className="status-time"
                          style={{
                            color:
                              privateMemberMsg.status === "online"
                                ? "yellowgreen"
                                : "red",
                          }}
                        >
                          {privateMemberMsg.status === "offline"
                            ? "offline"
                            : "online"}
                        </p>
                      </div>
                    </div>
                  </OverlayTrigger>
                </div>
              </>
            )}

            <div className="chatBox">
              {user &&
                messages.map(({ _id: date, messagesByDate }, idx) => (
                  <div key={idx}>
                    <p className="text-center text-light d-flex justify-content-center align-items-center">
                      <span className="bg-warning text-dark p-2 rounded-1">
                        {date}
                      </span>
                    </p>
                    {messagesByDate?.map(
                      ({ content, time, from: sender }, msgIdx) => (
                        <div
                          className={
                            sender?.email === user?.email
                              ? "message my-message"
                              : "message frnd-message"
                          }
                          key={msgIdx}
                        >
                          
                                        <div className="d-flex align-items-center mb-3">
                                            <img src={sender.picture} alt='logo' style={{ width: 35, height: 35, objectFit: "cover", borderRadius: "50%", marginRight: 10 }} />
                                            {/* <p className="message-sender">{sender._id === user?._id ? "You" : sender.name}</p> */}
                                        </div>
                                        <p className="message-content"><span className="text-success">{sender._id === user?._id ? "You" : sender.name}</span> {content} <br />{time}</p>
                                        {/* <p className="message-timestamp-left">{time}</p> */}
                                  
                        </div>
                      )
                    )}
                    <div ref={messageEndRef} />
                  </div>
                ))}
            </div>

            {user && currentRoom ?(
              <form className="chatbox-input" onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="type your message"
                  disabled={!user}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
                <i
                  className="fa-solid fa-paper-plane send"
                  disabled={!user}
                ></i>
              </form>
            ):(<></>)}
          </div>

        </div>
      </div>
    </>
  );
};

export default Chatgo;
