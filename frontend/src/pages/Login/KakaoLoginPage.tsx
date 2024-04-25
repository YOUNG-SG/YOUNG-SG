const KakaoLoginPage = () => {
  const queryParams = new URLSearchParams(location.search);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const code = queryParams.get("code");
  console.log(code);

  return (
    <>
      <div></div>
    </>
  );
};

export default KakaoLoginPage;
