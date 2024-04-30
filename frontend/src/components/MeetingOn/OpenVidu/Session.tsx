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

  const [nowSubscribers, setNowSubscribers] = useState(0);
  const maxSubscribers = 4;

  const handlePreSubscribers = () => {
    setNowSubscribers((preIndex) => {
      const nextIndex = preIndex - maxSubscribers;
      return nextIndex >= 0 ? nextIndex : 0;
    });
  };

  const handleNextSubscribers = () => {
    setNowSubscribers((preIndex) => {
      const nextIndex = preIndex + maxSubscribers;
      return nextIndex < subscribers.length ? nextIndex : preIndex;
    });
  };

  useEffect(() => {
    if (subscriber) {
      setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
    }
    if (!mainSubscriber) {
      setMainSubscriber(subscriber);
    }
  }, [subscriber, mainSubscriber]);

  const handleClickSubscriber = (subscriberItem: Subscriber) => {
    setMainSubscriber(subscriberItem);
  };

  const renderSubscribers = () => {
    const preSubscribers = nowSubscribers > 0;
    const nextSubscribers = nowSubscribers + maxSubscribers < subscribers.length;

    return (
      <div className={`flex flex-row justify-center gap-5 mb-5 cursor-pointer`}>
        {
          <button onClick={handlePreSubscribers}>
            {"<"} {preSubscribers}
          </button>
        }
        <div>
          <Video streamManager={publisher} />
        </div>
        {subscribers
          .slice(nowSubscribers, nowSubscribers + maxSubscribers)
          .map((subscriberItem) => (
            <div
              className="cursor-pointer aspect-video"
              key={subscriberItem.stream.streamId}
              onClick={() => handleClickSubscriber(subscriberItem)}
            >
              <Video streamManager={subscriberItem} />
            </div>
          ))}
        {
          <button onClick={handleNextSubscribers}>
            {">"} {nextSubscribers}
          </button>
        }
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
