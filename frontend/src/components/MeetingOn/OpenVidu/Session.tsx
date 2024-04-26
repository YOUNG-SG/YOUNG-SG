import { useState, useEffect } from "react";
import { Publisher, Subscriber } from "openvidu-browser";
import Video from "./Video";

interface SessionProps {
  subscriber: Subscriber;
  publisher: Publisher;
}

function Session({ subscriber, publisher }: SessionProps) {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [mainSubscriber, setMainSubscriber] = useState<Subscriber | null>();
  // useEffect(() => {
  //   if (!subscribers) {
  //     setSubscribers((preSubscriber) => [...preSubscriber, subscriber]);
  //   }
  // }, []);
  useEffect(() => {
    if (subscriber) {
      // console.log("여기입니까", subscribers);
      setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
    }
    // if (!mainSubscriber) {
    //   setMainSubscriber(subscriber);
    // }
  }, [subscriber]);

  const handleClickSubscriber = (subscriberItem: Subscriber) => {
    console.log("change main subscriber to: ", subscriberItem.stream.streamId);
    setMainSubscriber(subscriberItem);
  };

  const adjustGridPlacement = (subscriberCount: number) => {
    if (subscriberCount <= 1) {
      return "center";
    }
    return "normal";
  };

  const renderSubscribers = () => {
    const gridPlacement = adjustGridPlacement(subscribers.length);
    console.log("여기?", subscribers);

    return (
      <div
        className={`flex flex-row justify-center gap-5 mb-5 cursor-pointer ${gridPlacement}`}
        // style={{
        //   display: "grid",
        //   gridTemplateColumns: gridPlacement === "center" ? "1fr" : "1fr 1fr",
        //   gap: "20px",
        // }}
      >
        <div>
          <Video streamManager={publisher} />
        </div>
        {subscribers.map((subscriberItem) => (
          <div
            key={subscriberItem.stream.streamId}
            onClick={() => handleClickSubscriber(subscriberItem)}
          >
            <Video streamManager={subscriberItem} />
          </div>
        ))}
      </div>
    );
  };

  const renderMainSubscriber = () => {
    return (
      <div className="flex justify-center items-center">
        {mainSubscriber && <Video streamManager={mainSubscriber} />}
      </div>
    );
  };

  return (
    <>
      <div>{renderSubscribers()}</div>
      <div>{renderMainSubscriber()}</div>
    </>
  );
}

export default Session;
