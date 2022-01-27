import {
  Container,
  Form,
  Header,
  Input,
  InputOnChangeData,
  Select,
  TextArea,
} from "semantic-ui-react";
import Buttons from "../Atoms/Button/Buttons";
import MessageError from "../Atoms/Message/MessageError";
import HeaderBar from "../Molecules/HeaderBar/HeaderBar";
import styles from "./createvendorpage.module.css";
import { useState } from "react";

const timeOptions = [
  { key: "8AM ", text: "8AM-5PM", value: "hours1" },
  { key: "9AM", text: "9AM-6PM", value: "hours2" },
  { key: "10AM", text: "10Am-7PM", value: "hours3" },
];

const fileInput = () => {
  return <Input type="file" className={styles.input} size="small" fluid />;
};

const CreateVendorPage: React.FC = () => {
  const [input, setInput] = useState({
    name: "",
    businessAddress: "",
    phoneNumber: "",
    businessHours: "",
    website: "",
  });

  const onChange = ({ name, value }: InputOnChangeData) => {
    setInput((state) => ({ ...state, [name]: value }));
  };

  return (
    <Container className={styles.wrapper}>
      <HeaderBar logout />
      <Header as={"h2"} className={styles.header}>
        Create New Vendor Page
      </Header>
      <Form
        onSubmit={() => {
          console.log(input);
        }}
        className={styles.form}
      >
        <Form.Group widths="equal">
          <Form.Input
            name="name"
            onChange={(_, data) => onChange(data)}
            label="Name"
            placeholder="Name"
          />
          <Form.Input
            name="businessAddress"
            onChange={(_, data) => onChange(data)}
            label="Business Address"
            placeholder="Business Address"
          />
        </Form.Group>
        <Form.Group>
          <Form.Input
            name="phoneNumber"
            onChange={(_, data) => onChange(data)}
            label="Phone Number"
            placeholder="Phone Number"
          />
          <Form.Field
            control={Select}
            options={timeOptions}
            name="businessHours"
            onChange={(_, data) => onChange(data)}
            label="Business Hours"
            placeholder="Business Hours"
            search
          />
          <Form.Input
            name="website"
            onChange={(_, data) => onChange(data)}
            label="Website URL"
            placeholder="Website URL"
            width={8}
          />
        </Form.Group>

        <Form.Field
          control={fileInput}
          label="Upload Business Logo"
          width={5}
        />

        <Form.Field
          control={TextArea}
          label="Vendor Description"
          placeholder="Vendor Description"
        />

        <Buttons create color="green">
          Create
        </Buttons>
      </Form>
    </Container>
  );
};

export default CreateVendorPage;
