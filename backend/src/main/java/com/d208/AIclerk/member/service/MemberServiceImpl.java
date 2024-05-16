package com.d208.AIclerk.member.service;

import com.d208.AIclerk.common.S3Uploader;
import com.d208.AIclerk.entity.MeetingDetail;
import com.d208.AIclerk.entity.Member;
import com.d208.AIclerk.entity.MemberMeeting;
import com.d208.AIclerk.exception.member.MemberException;
import com.d208.AIclerk.meeting.dto.meetingListDto;
import com.d208.AIclerk.meeting.repository.MeetingDetailRepository;
import com.d208.AIclerk.meeting.repository.MeetingRoomRepository;
import com.d208.AIclerk.meeting.repository.MemberMeetingRepository;
import com.d208.AIclerk.member.dto.responseDto.*;
import com.d208.AIclerk.member.dto.requestDto.EditMemberRequestDto;
import com.d208.AIclerk.member.repository.MemberRepository;
import com.d208.AIclerk.member.repository.RefreshTokenRepository;
import com.d208.AIclerk.security.jwt.JWTUtil;
import com.d208.AIclerk.security.jwt.JwtProperties;
import com.d208.AIclerk.security.jwt.RefreshToken;
import com.d208.AIclerk.security.oauth.KakaoProfile;
import com.d208.AIclerk.utill.CommonUtil;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class MemberServiceImpl implements MemberService{
    private final JWTUtil jwtUtil;
    private final MemberRepository memberRepository; //(1)
    private final RefreshTokenRepository refreshTokenRepository;
    private final CommonUtil commonUtil;
    private final S3Uploader s3Uploader;
    private final MemberMeetingRepository memberMeetingRepository;
    private final MeetingRoomRepository meetingRoomRepository;
    private final MeetingDetailRepository meetingDetailRepository;


    @Value("${KAKAO_CLIENT_ID}")
    String ClientKey;

    @Value("${KAKAO_CLIENT_SECRET}")
    String SecretKey;

    @Value("${REDIRECT_URI}")
    String RedirectUri;

    private int accessTokenMinute = 20160;
    private int refreshTokenMinute = 3000;

    @Override
    public OauthToken getAccessToken(String code) {

        //(2)
        RestTemplate rt = new RestTemplate();

        //(3)
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        //(4)
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", ClientKey);
        params.add("redirect_uri", RedirectUri);
        params.add("code", code);
        params.add("client_secret", SecretKey);

        //(5)
        HttpEntity<MultiValueMap<String, String>> kakaoTokenRequest =
                new HttpEntity<>(params, headers);

        //(6)
        ResponseEntity<String> accessTokenResponse = rt.exchange(
                "https://kauth.kakao.com/oauth/token",
                HttpMethod.POST,
                kakaoTokenRequest,
                String.class
        );

        //(7)
        ObjectMapper objectMapper = new ObjectMapper();
        OauthToken oauthToken = null;
        try {
            oauthToken = objectMapper.readValue(accessTokenResponse.getBody(), OauthToken.class);
            System.out.println(oauthToken);

        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        return oauthToken; //(8)
    }


    @Override
    public KakaoProfile findProfile(String token) {

        //(1-2)
        RestTemplate rt = new RestTemplate();

        //(1-3)
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + token); //(1-4)
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        //(1-5)
        HttpEntity<MultiValueMap<String, String>> kakaoProfileRequest =
                new HttpEntity<>(headers);

        //(1-6)
        // Http 요청 (POST 방식) 후, response 변수에 응답을 받음
        ResponseEntity<String> kakaoProfileResponse = rt.exchange(
                "https://kapi.kakao.com/v2/user/me",
                HttpMethod.POST,
                kakaoProfileRequest,
                String.class
        );

        //(1-7)
        ObjectMapper objectMapper = new ObjectMapper();
        KakaoProfile kakaoProfile = null;
        try {
            kakaoProfile = objectMapper.readValue(kakaoProfileResponse.getBody(), KakaoProfile.class);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        return kakaoProfile;
    }

    @Override
    public ResponseEntity<GetMemberResponse> getProfile() {

        Member member = commonUtil.getMember();


        GetMemberResponseDTO getMemberResponseDTO = GetMemberResponseDTO.builder()
                .email(member.getEmail())
                .nickName(member.getNickname())
                .profileImg(member.getImage())
                .build();

        GetMemberResponse response = GetMemberResponse.creategetMemberResponse(
                "내 정보 조회 성공",
                getMemberResponseDTO
        );

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @Override
    public Map<String, String> saveUserAndGetTokens(String token) { //(1)
        KakaoProfile profile = findProfile(token);

        Member member = memberRepository.findByEmail(profile.getKakao_account().getEmail());
        if (member == null) {
            member = Member.builder()
                    .id(profile.getId())
                    .image(profile.getKakao_account().getProfile().getProfile_image_url())
                    .nickname(profile.getKakao_account().getProfile().getNickname())
                    .email(profile.getKakao_account().getEmail())
                    .build();

            memberRepository.save(member);
        }

        String accessToken = createAccessToken(member);
        String refreshToken = createRefreshToken(member);

        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", accessToken);
        tokens.put("refreshToken", refreshToken);

        return tokens; //(2)
    }


    public String createAccessToken(Member member) {
        try {
            return jwtUtil.createToken(member.getEmail(), accessTokenMinute);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public String createRefreshToken(Member member) {
        try {
            return jwtUtil.createToken(member.getEmail(), refreshTokenMinute);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public ResponseEntity signIn(String code) {
        // 인가 코드를 사용하여 OAuth 액세스 토큰을 검색
        String oauthAccessToken = getAccessToken(code).getAccess_token();

        // OAuth 정보를 기반으로 사용자 정보를 저장하고 토큰 가져오기
        Map<String, String> tokens = saveUserAndGetTokens(oauthAccessToken);
        String accessToken = tokens.get("accessToken");
        String refreshToken = tokens.get("refreshToken");

        // 저장소에 리프레시 토큰을 저장
        refreshTokenRepository.save(RefreshToken.builder()
                .email(tokens.get("userEmail")) // 이메일도 토큰 맵에서 추출
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build());

        // JWT를 표준 Authorization 헤더에 포함시켜 응답 헤더를 설정
        HttpHeaders headers = new HttpHeaders();
        headers.add(JwtProperties.HEADER_STRING, JwtProperties.TOKEN_PREFIX + accessToken);

        // 액세스 토큰과 새로 고침 토큰을 포함한 응답 객체 생성
        SignInResponseDTO signInResponseDTO = SignInResponseDTO.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();

        // 적절한 HTTP 헤더와 함께 토큰 응답을 반환
        return ResponseEntity.ok().headers(headers).body(signInResponseDTO);
    }

    @Override
    public ResponseEntity<EditMemberResponseDto> editProfile(EditMemberRequestDto dto) throws IOException {
        Member member = commonUtil.getMember();

        // imgUrl을 만들어서 s3에 저장 시작
        String imgUrl = "";
        if (dto.getProfileImg() == null) {
            imgUrl = member.getImage();
        } else {
            imgUrl = s3Uploader.upload(dto.getProfileImg());
        }

        member.setNickname(dto.getNickname());
        member.setImage(imgUrl);
        memberRepository.save(member);

        EditMemberResponseDto responseDto = EditMemberResponseDto.of(imgUrl, dto.getNickname());

        return ResponseEntity.status(HttpStatus.OK).body(responseDto);

    }

    @Override
    public ResponseEntity<TimeLineResponseDto> timeline() {
        Member member = commonUtil.getMember();
        // List 비었는지 체크해야함
        List<meetingListDto> meetingList = memberMeetingRepository.findAllByMemberOrderByStartTime(member);
        int month = LocalDateTime.now().getMonthValue();
        int year = LocalDateTime.now().getYear();

        // treemap response 생성
        TreeMap<Integer, TreeMap<Integer, List<TimeLineDayDto>>> response =  new TreeMap<>(Comparator.reverseOrder());
        for (meetingListDto meeting:meetingList) {
            // meetingroom의 id 가 detail에 존재하지 않는다면 그냥 넘기기
            List<MeetingDetail> meetingDetail = meetingDetailRepository.findAllByMeetingRoom_Id(meeting.getRoomId());
            if (meetingDetail == null) {
                continue;  // MeetingDetail이 존재하지 않으면 다음 반복으로 넘어감
            }

            // 연도와 월 체크 => 다르면 싹 갱신 연도 리스트에 월 리스트로 체크
            if (meeting.getStartTime().getYear() != year || meeting.getStartTime().getMonthValue() != month) {
                year = meeting.getStartTime().getYear();
                month = meeting.getStartTime().getMonthValue();
            }
            // year 값이 존재하는지 체크 => 없으면 추가
            if (response.getOrDefault(year, null) == null){
                // 키를 추가
                response.put(year, new TreeMap<>(Comparator.reverseOrder()));
            }
            // year의 리스트에 month 있는지 체크
            if (response.get(year).getOrDefault(month, null) == null){
                // 키를 추가
                response.get(year).put(month, new ArrayList<>());
            }
            response.get(year).get(month)
                    .add(TimeLineDayDto.of(meeting.getRoomId(), meeting.getStartTime().getDayOfMonth(),
                            meeting.getFolderTitle(), meeting.getRoomTitle()));
        }

        TimeLineResponseDto responseDto = TimeLineResponseDto.of(response);

        return ResponseEntity.status(HttpStatus.OK).body(responseDto);
    }

    @Override
    public ResponseEntity<String> deleteMeeting(Long usermeetingId) {
        // memberid 체크 -> 아니면 권한 없음 띄우기 : usermeetingId로 가능
        Member member = commonUtil.getMember();
        // 회의 목록 조회
        MemberMeeting memberMeeting = memberMeetingRepository.findById(usermeetingId)
                .orElseThrow(MemberException::memberMeetingNotFound);
        // 회의 목록 멤버 일치 확인
        if (!member.getId().equals(memberMeeting.getMember().getId())) {
            throw MemberException.memberMeetingNotEqualException();
        }

        memberMeetingRepository.deleteById(usermeetingId);

        return ResponseEntity.status(HttpStatus.OK).body("회의가 삭제되었습니다.");
    }

}
