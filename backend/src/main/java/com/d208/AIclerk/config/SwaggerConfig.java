package com.d208.AIclerk.config;


import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@OpenAPIDefinition(
        info = @Info(title = "Young서기 api",
                description = "Young서기 api",
                version = "V1"

        )
)
@Configuration
public class SwaggerConfig {

    @Bean
    public GroupedOpenApi meetingApi() {
        return GroupedOpenApi.builder()
                .group("meeting-api")
                .pathsToMatch("/meeting/**")
                .build();
    }


    @Bean
    public GroupedOpenApi chatApi() {
        return GroupedOpenApi.builder()
                .group("chat-api")
                .pathsToMatch("/api/meeting/**")
                .build();
    }

    @Bean
    public GroupedOpenApi KakaoApi() {
        return GroupedOpenApi.builder()
                .group("kakao-api")
                .pathsToMatch("/api/oauth/**")
                .build();
    }


}
