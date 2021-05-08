import {
  Resource,
  ResourceFirestore,
  ResourceInterface,
  ResourceJSON,
  isResourceJSON,
} from 'lib/model/resource';
import { isJSON, isStringArray } from 'lib/model/json';
import { DocumentSnapshot } from 'lib/api/firebase';
import { caps } from 'lib/utils';
import clone from 'lib/utils/clone';
import construct from 'lib/model/construct';
import definedVals from 'lib/model/defined-vals';

/**
 * @typedef {Object} UserInterface
 * @extends ResourceInterface
 * @property id - The user's Firebase Authentication ID.
 * @property name - The user's name.
 * @property photo - The user's avatar photo URL.
 * @property locale - The user's locale code (returned by Google OAuth2).
 * @property gender - The user's gender (returned by Google OAuth2).
 * @property email - The user's email address.
 * @property phone - The user's phone number.
 * @property token - The user's OAuth token that we use to access Gmail's API.
 * @property label - The Gmail label ID for the "Hammock" label
 * that we create when the user is onboarded.
 * @property filter - The Gmail filter ID that we create when the user signs up.
 * @property subscriptions - An array of newsletter email addresses that the
 * user has subscribed to (i.e. the newsletters that show up in their feed).
 */
export interface UserInterface extends ResourceInterface {
  id: string;
  name: string;
  photo: string;
  locale: string;
  gender: string;
  email: string;
  phone: string;
  token: string;
  label: string;
  filter: string;
  subscriptions: string[];
}

export type UserJSON = Omit<UserInterface, keyof Resource> & ResourceJSON;
export type UserFirestore = Omit<UserInterface, keyof Resource> &
  ResourceFirestore;

export function isUserJSON(json: unknown): json is UserJSON {
  const stringFields = [
    'id',
    'name',
    'photo',
    'locale',
    'gender',
    'email',
    'phone',
    'token',
    'label',
    'filter',
  ];

  if (!isResourceJSON(json)) return false;
  if (!isJSON(json)) return false;
  if (stringFields.some((key) => typeof json[key] !== 'string')) return false;
  if (!isStringArray(json.subscriptions)) return false;
  return true;
}

export class User extends Resource implements UserInterface {
  public id = '';

  public name = '';

  public photo = '';

  public locale = '';

  public gender = '';

  public email = '';

  public phone = '';

  public token = '';

  public label = '';

  public filter = '';

  public subscriptions: string[] = [];

  public constructor(user: Partial<UserInterface> = {}) {
    super(user);
    construct<UserInterface, ResourceInterface>(this, user, new Resource());
  }

  public get firstName(): string {
    return caps(this.name.split(' ')[0] || '');
  }

  public get lastName(): string {
    const parts: string[] = this.name.split(' ');
    return caps(parts[parts.length - 1] || '');
  }

  public get clone(): User {
    return new User(clone(this));
  }

  public toJSON(): UserJSON {
    return definedVals({ ...this, ...super.toJSON() });
  }

  public static fromJSON(json: UserJSON): User {
    return new User({ ...json, ...Resource.fromJSON(json) });
  }

  public toFirestore(): UserFirestore {
    return definedVals({ ...this, ...super.toFirestore() });
  }

  public static fromFirestore(data: UserFirestore): User {
    return new User({ ...data, ...Resource.fromFirestore(data) });
  }

  public static fromFirestoreDoc(snapshot: DocumentSnapshot): User {
    if (!snapshot.exists) return new User();
    const overrides = definedVals({
      created: snapshot.createTime?.toDate(),
      updated: snapshot.updateTime?.toDate(),
      id: snapshot.id,
    });
    const user = User.fromFirestore(snapshot.data() as UserFirestore);
    return new User({ ...user, ...overrides });
  }

  public toString(): string {
    return `${this.name}${this.id ? ` (${this.id})` : ''}`;
  }
}
