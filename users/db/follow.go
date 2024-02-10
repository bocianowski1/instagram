package db

func FollowUser(username, followingUsername string) error {
	user, err := GetUserByUsername(username)
	if err != nil {
		return err
	}

	followingUser, err := GetUserByUsername(followingUsername)
	if err != nil {
		return err
	}

	if user == nil || followingUser == nil {
		return nil
	}

	if err := Db.Model(user).Association("Following").Append(followingUser); err != nil {
		return err
	}

	if err := Db.Model(followingUser).Association("Followers").Append(user); err != nil {
		return err
	}

	return nil
}

func UnfollowUser(username, followingUsername string) error {
	user, err := GetUserByUsername(username)
	if err != nil {
		return err
	}

	followingUser, err := GetUserByUsername(followingUsername)
	if err != nil {
		return err
	}

	if user == nil || followingUser == nil {
		return nil
	}

	if err := Db.Model(user).Association("Following").Delete(followingUser); err != nil {
		return err
	}

	if err := Db.Model(followingUser).Association("Followers").Delete(user); err != nil {
		return err
	}

	return nil
}
