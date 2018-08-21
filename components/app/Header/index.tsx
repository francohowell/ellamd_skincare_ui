import {Menu, MenuDivider, MenuItem} from "@blueprintjs/core";
import {Popover2 as Popover} from "@blueprintjs/labs";
import {inject, observer} from "mobx-react";
import * as React from "react";
import {NavLink} from "react-router-dom";

import {Avatar} from "components/identities";
import {Customer} from "models";
import {IdentityStore} from "stores";
import {ROUTES} from "utilities";

import * as styles from "./index.css";

interface Props {
  identityStore?: IdentityStore;
}

/**
 * The Header component is the top-level header for the app, including navigation.
 */
@inject("identityStore")
@observer
export class Header extends React.Component<Props> {
  public render() {
    const isGuest = !this.props.identityStore!.isSignedIn;
    const links = isGuest ? this.renderGuestLinks() : this.renderUserLinks();

    const headerStyles = [styles.header];
    if (this.inTimelineView()) {
      headerStyles.push(styles.headerCustomer);
    }

    return (
      <header className={headerStyles.join(" ")} id="header">
        <h1 className={styles.logo}>
          <a href="https://ellamd.com">
            <span>Ella</span>MD
          </a>
        </h1>

        <nav className={styles.navigation}>{links}</nav>
      </header>
    );
  }

  private renderGuestLinks() {
    return (
      <div>
        <NavLink
          exact={true}
          className={styles.link}
          activeClassName={styles.active}
          to={ROUTES.signIn}
        >
          Sign in
        </NavLink>

        <NavLink
          exact={true}
          className={styles.link}
          activeClassName={styles.active}
          to={ROUTES.signUp}
        >
          Sign up
        </NavLink>
      </div>
    );
  }

  private renderUserLinks() {
    return (
      <div>
        {this.renderUserTypeSpecificLinks()}
        <Popover content={this.renderUserMenu()} target={this.renderUserAvatarButton()} />
      </div>
    );
  }

  private renderUserTypeSpecificLinks() {
    const {userType} = this.props.identityStore!.currentIdentity!;

    switch (userType) {
      case "Customer":
        return this.renderCustomerLinks();
      case "Physician":
        return this.renderPhysicianLinks();
      case "Pharmacist":
        return this.renderPharmacistLinks();
      case "Administrator":
        return this.renderAdministratorLinks();
    }
  }

  private renderUserAvatarButton() {
    const currentIdentity = this.props.identityStore!.currentIdentity!;

    return <Avatar identity={currentIdentity} className={styles.avatarButton} />;
  }

  private renderUserMenu() {
    const currentIdentity = this.props.identityStore!.currentIdentity!;
    const name = `${currentIdentity.firstName} ${currentIdentity.lastName}`;

    return (
      <Menu>
        <MenuItem disabled={true} text={`Signed in as ${name}`} />
        <MenuDivider />
        <MenuItem onClick={() => this.props.identityStore!.signOut()} text="Sign out" />
      </Menu>
    );
  }

  private renderCustomerLinks() {
    if (this.inTimelineView()) {
      return this.renderLink("My Timeline", ROUTES.dashboard);
    } else {
      return undefined;
    }
  }

  private renderPhysicianLinks() {
    return this.renderLink("Physician Dashboard", ROUTES.dashboard);
  }

  private renderPharmacistLinks() {
    return this.renderLink("Pharmacist Dashboard", ROUTES.dashboard);
  }

  private renderAdministratorLinks() {
    return (
      <span>
        {this.renderLink("Admin Dashboard", ROUTES.dashboard)}
        {this.renderLink("Products", ROUTES.productsIndex)}
      </span>
    );
  }

  private renderLink(title: string, route: string) {
    return (
      <NavLink exact={true} className={styles.link} activeClassName={styles.active} to={route}>
        {title}
      </NavLink>
    );
  }

  private inTimelineView(): boolean {
    const {currentIdentity} = this.props.identityStore!;

    return (
      !!currentIdentity &&
      currentIdentity!.userType === "Customer" &&
      (currentIdentity!.user as Customer).isOnboarded
    );
  }
}
