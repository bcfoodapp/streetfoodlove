import {
  Container,
  Form,
  Header,
  Input,
  Select,
  TextArea,
} from "semantic-ui-react";
import Buttons from "../Atoms/Button/Buttons";
import MessageError from "../Atoms/Message/MessageError";
import HeaderBar from "../Molecules/HeaderBar/HeaderBar";
import styles from "./createvendorpage.module.css";

const timeOptions = [
  { key: "8AM ", text: "8AM-5PM", value: "hours1" },
  { key: "9AM", text: "9AM-6PM", value: "hours2" },
  { key: "10AM", text: "10Am-7PM", value: "hours3" },
];

const fileInput = () => {
  return <Input type="file" className={styles.input} size="small" fluid />;
};

const CreateVendorPage: React.FC = () => {
  return (
    <Container className={styles.wrapper}>
      <HeaderBar logout />
      {/* <MessageError /> */}
      <Header as={"h2"} className={styles.header}>
        Create New Vendor Page
      </Header>
      <Form className={styles.form}>
        <Form.Group widths="equal">
          <Form.Field control={Input} label="Name" placeholder="Name" />
          <Form.Field
            control={Input}
            label="Business Address"
            placeholder="Business Address"
          />
        </Form.Group>
        <Form.Group>
          <Form.Field
            control={Input}
            label="Phone Number"
            placeholder="Phone Number"
          />
          <Form.Field
            control={Select}
            options={timeOptions}
            label={{
              children: "Business Hours",
            }}
            placeholder="Business Hours"
            search
          />
          <Form.Field
            control={Input}
            label="Website URL"
            placeholder="Website URL"
            width={8}
          />
        </Form.Group>

        <Form.Field
          control={fileInput}
          label="Upload Business Logo"
          placeholder="Website URL"
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
