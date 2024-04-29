package com.d208.AIclerk.member.dto.responseDto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GetMemberResponse {

    @Schema(description = "상태 메시지", example = "Success")
    private String message;
    @Schema(description = "데이터")
    private GetMemberResponseDTO data;

    public static GetMemberResponse creategetMemberResponse(String message, GetMemberResponseDTO dto) {
        return GetMemberResponse.builder()
                .message(message)
                .data(dto)
                .build();
    }
}
