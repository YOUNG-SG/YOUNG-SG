package com.d208.AIclerk.utill;

import com.d208.AIclerk.entity.Member;
import com.d208.AIclerk.member.exception.MemberNotFoundException;
import com.d208.AIclerk.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CommonUtil {

    private final MemberRepository memberRepository;

    public Member getMember() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        Member currentMember = memberRepository.findByEmail(email);

        if (currentMember == null) {
            throw new MemberNotFoundException("유저를 찾을 수 없습니다.");
        }

        return currentMember;
    }

}