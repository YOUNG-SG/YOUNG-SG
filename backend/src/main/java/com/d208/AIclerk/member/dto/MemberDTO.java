package com.d208.AIclerk.member.dto;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.List;
import java.util.stream.Collectors;

public class MemberDTO extends User {

    public MemberDTO(String nickname, String password, List<String> roleNames) {
        super(
                String.valueOf(nickname),
                "",
                roleNames.stream().map(str -> new SimpleGrantedAuthority("ROLE_" + str)).collect(Collectors.toList()));
    }
}
