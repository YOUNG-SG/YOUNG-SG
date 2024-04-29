package com.d208.AIclerk.config;


import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;

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

    @Bean
    public OpenAPI openAPI(){
        SecurityScheme securityScheme = new SecurityScheme()
                .type(SecurityScheme.Type.HTTP).scheme("bearer").bearerFormat("JWT")
                .in(SecurityScheme.In.HEADER).name("Authorization");
        SecurityRequirement securityRequirement = new SecurityRequirement().addList("bearerAuth");

        return new OpenAPI()
                .components(new Components().addSecuritySchemes("bearerAuth", securityScheme))
                .security(Arrays.asList(securityRequirement));
    }


}
