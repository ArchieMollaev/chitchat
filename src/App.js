import React, { useRef, useState } from "react";
import "./App.css";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/analytics";
import "firebase/storage";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { ImageUpload } from "./components/ImageUpload";
import { uid } from "uid";
import ImageViewer from "react-simple-image-viewer";

firebase.initializeApp({
  apiKey: "AIzaSyDO0s1jl1dlHn5r2RvR0fuTg8qivFdmCb8",
  authDomain: "my-super-chat-cfffb.firebaseapp.com",
  projectId: "my-super-chat-cfffb",
  storageBucket: "my-super-chat-cfffb.appspot.com",
  messagingSenderId: "767847161654",
  appId: "1:767847161654:web:509f91c568cac96d9a1d97",
  measurementId: "G-70LHPGNZPG",
});

const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>

      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>
        Sign in with Google
      </button>
      <p>
        Do not violate the community guidelines or you will be banned for life!
      </p>
    </>
  );
}

function SignOut() {
  return (
    auth.currentUser && (
      <button className="sign-out" onClick={() => auth.signOut()}>
        Sign Out
      </button>
    )
  );
}

function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(25);

  const [messages] = useCollectionData(query, { idField: "id" });

  const [formValue, setFormValue] = useState("");
  const [img, setImg] = useState(null);

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    const { imgSrc } = img ? await uploadImage(img) : { imgSrc: "" };

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
      imgSrc,
    });

    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <main>
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}

        <span ref={dummy}></span>
      </main>

      <div className="send-message-form-container">
        <ImageUpload onImageChange={setImg} />
        <form onSubmit={sendMessage}>
          <input
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
            placeholder="Message"
          />

          <button type="submit" disabled={!formValue}>
            🕊️
          </button>
        </form>
      </div>
    </>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL, imgSrc } = props.message;
  console.log("imgSrc", imgSrc);

  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";
  const [isViewerOpened, setIsViewerOpened] = useState(false);
  const openViewer = () => setIsViewerOpened(true);

  return (
    <>
      <div className={`message ${messageClass}`}>
        <img
          className="avatar-img"
          src={
            photoURL || "https://api.adorable.io/avatars/23/abott@adorable.png"
          }
        />
        <p className="message-text">
          {imgSrc && (
            <>
              <img
                className="attachment-preview"
                src={imgSrc}
                onClick={openViewer}
              />
              {isViewerOpened && (
                <ImageViewer
                  src={[imgSrc]}
                  currentIndex={0}
                  disableScroll={false}
                  closeOnClickOutside={true}
                  onClose={() => {
                    setIsViewerOpened(false);
                  }}
                />
              )}
            </>
          )}
          {text}
        </p>
      </div>
    </>
  );
}

/**
 *
 * @param {Blob} file
 * @returns {Promise<{ imgSrc: string }>}
 */
async function uploadImage(file) {
  const storage = firebase.storage().ref();
  const image = storage.child(`attached-image-${uid(16)}.jpg`);

  await image.put(file);

  const imgSrc = await image.getDownloadURL();

  return { imgSrc };
}

export default App;
