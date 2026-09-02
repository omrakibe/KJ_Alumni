package com.kjalumni.admin.specification;

import com.kjalumni.alumni.entity.Alumni;
import com.kjalumni.auth.entity.User;
import com.kjalumni.common.enums.Branch;
import com.kjalumni.common.enums.UserStatus;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;

public final class AlumniSpecification
{

    private AlumniSpecification()
    {
    }

    public static Specification<Alumni> search(
            String search
    )
    {
        return (root, query, cb) ->
        {
            if (search == null || search.isBlank())
            {
                return cb.conjunction();
            }

            String value =
                    "%" + search.trim().toLowerCase() + "%";

            Join<Alumni, User> user =
                    root.join("user");

            Expression<String> alumniId =
                    cb.lower(root.get("alumniId"));

            Expression<String> firstName =
                    cb.lower(root.get("firstName"));

            Expression<String> middleName =
                    cb.lower(root.get("middleName"));

            Expression<String> lastName =
                    cb.lower(root.get("lastName"));

            Expression<String> fullName = cb.lower(
                    cb.concat(
                            cb.concat(
                                    cb.concat(root.get("firstName"), " "),
                                    cb.coalesce(root.get("middleName"), "")
                            ),
                            cb.concat(" ", root.get("lastName"))
                    )
            );

            Expression<String> email =
                    cb.lower(user.get("email"));

            Expression<String> contactNumber =
                    cb.lower(root.get("contactNumber"));

            return cb.or(
                    cb.like(alumniId, value),
                    cb.like(firstName, value),
                    cb.like(middleName, value),
                    cb.like(lastName, value),
                    cb.like(fullName, value),
                    cb.like(email, value),
                    cb.like(contactNumber, value)
            );
        };
    }

    public static Specification<Alumni> hasBranch(
            Branch branch
    )
    {
        return (root, query, cb) ->
        {
            if (branch == null)
            {
                return cb.conjunction();
            }

            return cb.equal(
                    root.get("branch"),
                    branch
            );
        };
    }

    public static Specification<Alumni> hasPassoutYear(
            Integer passoutYear
    )
    {
        return (root, query, cb) ->
        {
            if (passoutYear == null)
            {
                return cb.conjunction();
            }

            return cb.equal(
                    root.get("passoutYear"),
                    passoutYear
            );
        };
    }

    public static Specification<Alumni> hasStatus(
            UserStatus status
    )
    {
        return (root, query, cb) ->
        {
            if (status == null)
            {
                return cb.conjunction();
            }

            Join<Alumni, User> user =
                    root.join("user");

            return cb.equal(
                    user.get("status"),
                    status
            );
        };
    }
}
