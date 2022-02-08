import React, { useEffect, useState } from "react";
import { Container, Form } from "semantic-ui-react";
import Buttons from "../../Atoms/Button/Buttons";
import styles from "./accountformgroup.module.css";
import {
  getUserIDFromToken,
  useGetTokenQuery,
  useUpdateUserMutation,
  useUserProtectedQuery,
} from "../../../../api";
import { UserType } from "../../../../api";

const AccountSettingsFormGroup: React.FC<{
  disabled: boolean;
  setDisabledForm: (value: boolean) => void;
}> = ({ disabled, setDisabledForm }) => {
  const { data: token, isSuccess: tokenIsSuccess } = useGetTokenQuery();

  let userID = "";
  if (tokenIsSuccess && token !== null) {
    userID = getUserIDFromToken(token as string);
  }
  const {
    data: user,
    isSuccess: userQueryIsSuccess,
    isLoading: userQueryIsLoading,
  } = useUserProtectedQuery(userID, { skip: userID === "" });

  const [updateUser, { isLoading: updateUserIsLoading }] =
    useUpdateUserMutation();
  console.log(updateUserIsLoading);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    if (userQueryIsSuccess) {
      setEmail(user!.Email);
      setFirstName(user!.FirstName);
      setLastName(user!.LastName);
    }
  }, [userQueryIsSuccess]);

  const handleSubmit = async () => {
    const response = await updateUser({
      ID: userID,
      Photo: user!.Photo,
      Username: user!.Username,
      Email: email,
      FirstName: firstName,
      LastName: lastName,
      UserType: UserType.Customer,
      SignUpDate: user!.SignUpDate,
    });
    if ((response as any).error === undefined) {
      alert("Updated User Settings!");
    }
  };

  if (tokenIsSuccess && token === null) {
    return <p>Not logged in</p>;
  }

  return (
    <Container className={styles.wrapper}>
      <Form onSubmit={handleSubmit}>
        <Form.Group widths={2}>
          <Form.Input
            label="First Name"
            placeholder="First Name"
            disabled={disabled}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            loading={userQueryIsLoading}
          />
          <Form.Input
            label="Last Name"
            placeholder="Last Name"
            disabled={disabled}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            loading={userQueryIsLoading}
          />
          <Form.Input
            label="Email"
            placeholder="Email"
            disabled={disabled}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            loading={userQueryIsLoading}
          />
        </Form.Group>
        <Container className={styles.saveBtn}>
          {userQueryIsSuccess ? (
            <Buttons
              submit
              color="green"
              clicked={() => setDisabledForm(true)}
              loading={updateUserIsLoading}
            >
              Save
            </Buttons>
          ) : null}
        </Container>
      </Form>
    </Container>
  );
};

export default AccountSettingsFormGroup;
