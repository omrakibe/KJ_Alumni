package com.kjalumni.event.dto;
import com.kjalumni.common.enums.Branch;
import com.kjalumni.common.enums.EventVisibility;
import jakarta.validation.constraints.*;
import lombok.Getter; import lombok.Setter;
import java.time.LocalDateTime;
@Getter @Setter public class EventRequest {
 @NotBlank @Size(max=180) private String title;
 @NotBlank private String description;
 @NotNull @Future private LocalDateTime eventDateTime;
 @NotBlank @Size(max=255) private String venue;
 @NotNull private EventVisibility visibility;
 private Branch branch;
}
