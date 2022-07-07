import { RequestHandler } from 'express';
import { createUser } from '../config/createUser';
import { deleteUser } from '../config/deleteUser';

const isEmpty = (str: string) => str.trim().length === 0;
const validEmail = (email: string) =>
  email.match(
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  );

export const createUserController: RequestHandler = async (req, res) => {
  const { email, password, userUid } = req.body;

  if (isEmpty(email) || isEmpty(password) || isEmpty(userUid)) {
    return res
      .status(422)
      .send({ status: 'error', messsage: 'Please provide all data!' });
  }

  if (!validEmail(email)) {
    return res
      .status(422)
      .send({ status: 'error', messsage: 'Please provide valid email!' });
  }

  try {
    res.send(await createUser({ email, password }, userUid));
  } catch (error: any) {
    res.status(400).send({ status: 'error', message: error.message });
  }
};

export const deleteUserController: RequestHandler = async (req, res) => {
  const { userToDeleteUid, userUid } = req.body;

  if (isEmpty(userToDeleteUid) || isEmpty(userUid)) {
    return res
      .status(422)
      .send({ status: 'error', messsage: 'Please provide all data!' });
  }

  try {
    res.send(await deleteUser(userToDeleteUid, userUid));
  } catch (error: any) {
    res.status(400).send({ status: 'error', message: error.message });
  }
};
