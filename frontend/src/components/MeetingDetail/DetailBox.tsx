const DetailBox: React.FC<{
  children?: React.ReactNode;
  title: string;
  icon?: React.SVGProps<SVGSVGElement>;
}> = (props) => {
  return (
    <div className="w-full h-full bg-e-20 rounded-2xl flex justify-center items-center">
      <div style={{ width: "calc(100% - 60px)", height: "calc(100% - 60px)" }}>
        <div className="flex justify-between">
          <div className="text-[28px] font-extrabold mb-[15px]">{props.title}</div>
          <>{props.icon}</>
        </div>
        {props.children}
      </div>
    </div>
  );
};

export default DetailBox;
