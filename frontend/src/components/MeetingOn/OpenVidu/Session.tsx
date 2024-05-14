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

  // useEffect(() => {
  //   if (subscriber) {
  //     setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
  //   }
  //   if (!mainSubscriber) {
  //     setMainSubscriber(subscriber);
  //   }
  // }, [subscriber, mainSubscriber]);

  useEffect(() => {
    if (subscriber) {
      setSubscribers((prevSubscribers) => {
        // 새로운 subscriber가 이미 배열에 있는지 확인
        const isAlreadyAdded = prevSubscribers.some(
          (sub) => sub.stream.streamId === subscriber.stream.streamId,
        );
        if (!isAlreadyAdded) {
          return [...prevSubscribers, subscriber];
        }
        return prevSubscribers;
      });
    }
    if (!mainSubscriber) {
      setMainSubscriber(subscriber);
    }
  }, [subscriber]);

  const handleClickSubscriber = (subscriberItem: Subscriber) => {
    setMainSubscriber(subscriberItem);
  };

  const renderSubscribers = () => {
    const preSubscribers = nowSubscribers > 0;
    const nextSubscribers = nowSubscribers + maxSubscribers < subscribers.length;

    return (
      <div className="flex flex-row justify-center gap-5 py-5 cursor-pointer row-span-3">
        <button onClick={handlePreSubscribers} className="focus:outline-none">
          {"<"} {preSubscribers}
        </button>
        <div className="flex flex-wrap justify-center items-center space-x-4">
          <Video streamManager={publisher} />
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
        </div>
        <button onClick={handleNextSubscribers} className="focus:outline-none">
          {">"} {nextSubscribers}
        </button>
      </div>
    );
  };

  const renderMainSubscriber = () => {
    return (
      <div className="flex justify-center items-center row-span-7">
        {mainSubscriber && <Video streamManager={mainSubscriber} />}
      </div>
    );
  };

  return (
    <>
      <div className="row-span-3 h-full w-full ">{renderSubscribers()}</div>
      <div className="row-span-7 flex justify-center items-center w-full h-full">
        {renderMainSubscriber()}
      </div>
    </>
  );
}

export default Session;
