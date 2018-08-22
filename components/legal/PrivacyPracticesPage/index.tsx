import * as React from "react";
import {RouteComponentProps} from "react-router-dom";

import * as styles from "./index.css";

interface Props extends RouteComponentProps<any> {}

/**
 * The PrivacyPracticesPage is a static page with EllaMD's privacy policy.
 *
 * NOTE: This HTML is exported from Word and cleaned up.
 */
export class PrivacyPracticesPage extends React.Component<Props> {
  public render() {
    return (
      <div className={["pt-card", styles.legalDocument].join(" ")}>
        <h2>Privacy Practices</h2>
        <p>
          <b>
            <i>Last Revised July 14, 2017 (“Effective Date”)</i>
          </b>
        </p>
        <p>
          <b>
            THIS NOTICE OF PRIVACY PRACTICE DESCRIBES HOW MEDICAL INFORMATION ABOUT YOU MAY BE USED
            AND DISCLOSED AND HOW YOU CAN GET ACCESS TO THIS INFORMATION. PLEASE REVIEW THIS NOTICE
            CAREFULLY.
          </b>
        </p>
        <p>
          EllaMD, Inc. (“EllaMD”, “us”, “we”, “our”) provides personalized skin care services,
          including delivery of personalized dermatological products (collectively, the “Services”).
          EllaMD operates the website located at https://www.ellamd.com and other related websites
          and mobile applications with links (collectively, the “Site”) to this Notice of Privacy
          Practices (“Notice”). EllaMD understands that information about you and your health is
          personal and respects the privacy of each and every person, and is committed to protecting
          and maintaining the confidentiality of all of your personal and protected health
          information (“PHI”). We continuously seek to safeguard this information through
          administrative, physical, and technical means, and otherwise to abide by applicable
          federal and state data privacy and security guidelines.
        </p>
        <p>
          This Notice describes how your PHI may be used and disclosed by EllaMD and how you can get
          access to this information. This Notice will serve as a summary of your privacy rights.
          EllaMD must provide you with this Notice and follow the terms of this Notice while it is
          in effect. Your use of EllaMD’s Services indicates your acceptance of the terms of this
          Notice. <b>PLEASE REVIEW THIS NOTICE CAREFULLY.</b>
        </p>
        <p>
          The Health Insurance Portability and Accountability Act of 1996 (“HIPAA”) imposes numerous
          requirements on the use and disclosure of individually identifiable health information by
          EllaMD. The term individually identifiable health information means information that:
        </p>
        <ul className={styles.squareMarkeredList}>
          <li>
            Is created or received by a health care provider, health plan, employer or health care
            clearinghouse;
          </li>
          <li>
            Relates to the past, present or future physical or mental health or condition of an
            individual; the provision of health care to an individual; or the past, present or
            future payment for the provision of health care to an individual; and
          </li>
          <li>
            Identifies the individual, or there is a reasonable basis to believe that the
            information can be used to determine the identity of the individual.
          </li>
        </ul>
        <p>
          This information is known as PHI, and, as illustrated above, includes almost all
          individually identifiable health information held by a covered entity, such as a health
          care provider — whether received in writing, in an electronic medium, or as an oral
          communication. This notice describes the privacy practices of EllaMD. Understanding what
          PHI is and how it is used will help you make more informed decisions if you are asked to
          sign an authorization to disclose your PHI to others, as required by HIPAA.
        </p>
        <p>
          <b>
            <i>
              What are EllaMD’s obligations regarding the privacy and confidentiality of my PHI?
            </i>
          </b>
        </p>
        <p>
          EllaMD is required by law to maintain the privacy and confidentiality of your PHI and to
          provide you with this notice of its legal duties and privacy practices with respect to
          your PHI.
        </p>
        <p>
          <b>
            <i>How does EllaMD use and disclose my PHI?</i>
          </b>
        </p>
        <p>
          Generally, under HIPAA, EllaMD only may use and disclose your PHI with your authorization,
          subject to certain exceptions. These exceptions allow EllaMD to use and disclose your PHI
          without your authorization for purposes of: (i) treatment, (ii) payment, and (iii) health
          care operations. This Notice provides examples of those activities, although not every use
          or disclosure falling within each category is listed:
        </p>
        <p>
          <b>
            <i>Treatment –</i>
          </b>{" "}
          EllaMD keeps a record of the PHI you provide to us. This record may include test results,
          diagnoses, medications, your response(s) to medications or other therapies, and other
          information we learn about your medical condition through the online services. We may
          disclose this information so that other doctors, nurses, and entities such as laboratories
          can meet your health care needs.
        </p>
        <p>
          <b>
            <i>Payment –</i>
          </b>{" "}
          EllaMD documents the services and supplies you receive when we are providing care to you
          so that you (or if applicable, your insurance company or another third party) can
          reimburse us for provision of the Services. If applicable, we may share information with
          your health plan regarding upcoming treatments or services that require prior approval or
          authorization by your health plan.
        </p>
        <p>
          <b>
            <i>Health Care Operations –</i>
          </b>{" "}
          Patient health information is used to improve the services we provide, to train our staff,
          for business management, for quality improvement, and for customer service. For example,
          EllaMD may use or disclose your PHI to review our treatment and services and to evaluate
          the performance of our staff in caring for you.
        </p>
        <p>
          The amount of PHI used, disclosed or requested will be limited as required under HIPAA to
          the minimum necessary amount to accomplish the intended purposes of such use and/or
          disclosure. If EllaMD uses or discloses PHI for underwriting purposes, EllaMD will not use
          or disclose PHI that is your genetic information for such purposes.
        </p>
        <p>EllaMD may, without your written authorization, also use your PHI to:</p>
        <p>
          <span>
            ·<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </span>{" "}
          Comply with federal, state, or local laws that require disclosure of such information. For
          example, EllaMD must allow the U.S. Department of Health and Human Services to audit its
          records;
        </p>
        <p>
          <span>
            ·<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </span>{" "}
          Assist in public health activities such as tracking diseases;
        </p>
        <p>
          <span>
            ·<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </span>{" "}
          Inform authorities to protect victims of abuse or neglect;
        </p>
        <p>
          <span>
            ·<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </span>{" "}
          Comply with federal and/or state health oversight activities such as fraud investigations;
        </p>
        <p>
          <span>
            ·<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </span>{" "}
          Respond to law enforcement officials or to judicial orders, subpoenas, or other process;
        </p>
        <p>
          <span>
            ·<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </span>{" "}
          Inform coroners, medical examiners, and funeral directors of information necessary for
          them to fulfill their duties;
        </p>
        <p>
          <span>
            ·<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </span>{" "}
          Facilitate organ and tissue donation or procurement;
        </p>
        <p>
          <span>
            ·<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </span>{" "}
          Conduct research following internal review protocols to ensure the balancing of privacy
          and research needs;
        </p>
        <p>
          <span>
            ·<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </span>{" "}
          Avert a serious threat to health or safety;
        </p>
        <p>
          <span>
            ·<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </span>{" "}
          Assist in specialized government functions such as national security, intelligence, and
          protective services.
        </p>
        <p>
          <span>
            ·<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </span>{" "}
          Inform military and veteran authorities if you are an armed forces member (active or
          reserve);
        </p>
        <p>
          <span>
            ·<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </span>{" "}
          Inform a correctional institution if you are an inmate;
        </p>
        <p>
          <span>
            ·<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </span>{" "}
          Inform workers’ compensation carriers and/or your employer if you are injured at work;
        </p>
        <p>
          <span>
            ·<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </span>{" "}
          Recommend treatment alternatives;
        </p>
        <p>
          <span>
            ·<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </span>{" "}
          Tell you about health-related products and services;
        </p>
        <p>
          <span>
            ·<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </span>{" "}
          Communicate within our organization for treatment, payment, or health care operations;
        </p>
        <p>
          <span>
            ·<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </span>{" "}
          Communicate with other providers, health plans, or their related entities for their
          treatment or payment activities, or health care operations activities relating to quality
          assessment or licensing; and
        </p>
        <p>
          <span>
            ·<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </span>{" "}
          Provide information to other third parties with whom we do business, including our
          business associates, such as a record storage provider (however, you should know that in
          these situations, we require third parties to provide us with comparable assurances that
          they will safeguard your information).
        </p>
        <p>
          Except as set forth within this Notice, EllaMD will only use or disclose your PHI with
          your written authorization.
        </p>
        <p>
          Additionally, EllaMD may use or disclose your PHI for operational purposes including (but
          not limited to) communicating with individuals who are involved in your care (or payment
          for that care (e.g., family, friends)). Information about your location, general
          condition, or death may be provided to a similar person (or to a public or private entity
          authorized to assist in disaster relief efforts). Generally, you will be given the
          opportunity to agree or object to these disclosures (although exceptions may be made, for
          example, if you are not present or if you are incapacitated). In addition, your PHI may be
          disclosed without authorization to your legal representative.
        </p>
        <p>
          We may also use your PHI for operational purposes such as to send appointment reminders,
          to tell you about different types of treatment alternatives, and for research-related
          purposes. We will only make these types of disclosures with your express written consent,
          and you may revoke that consent in writing at any time; however, this will not affect
          prior uses and disclosures. For example, we need your express, written authorization
          before we may use or disclose your PHI for marketing purposes or before we would sell your
          information. You may revoke your authorization as allowed under HIPAA. You cannot,
          however, revoke your authorization with respect to disclosures that EllaMD has already
          made.
        </p>
        <p>
          <b>
            <i>
              Please note that in some cases, state law may require that we apply extra protections
              to some of your health information.
            </i>
          </b>
        </p>
        <p>
          <b>
            <i>What are EllaMD’s responsibilities with respect to the security of my PHI?</i>
          </b>
        </p>
        <p>
          The importance of security for all personal information including, but not limited to, PHI
          associated with you, is of utmost concern to EllaMD. EllaMD uses reasonable and
          appropriate safeguards to protect the security and confidentiality of your PHI and other
          personal information.&nbsp; At EllaMD we take care to provide secure transmission of your
          PHI and other personal information from your PC or mobile device to our servers and/or our
          Site. PHI and other personal information collected by our Site is stored in secure
          operation environments that are not available to the public. Only those EllaMD employees
          who need access to your PHI and other personal information in order to do their jobs are
          allowed access, and only after they have been trained regarding EllaMD’s confidentiality
          obligations. Further, our password and authentication system is user specific to ensure
          that users can only see the specific information to which they have been granted access.
          Any EllaMD employee who violates our privacy and security policies is subject to
          disciplinary action, including possible termination and civil and/or criminal prosecution.
          You will be notified of any unauthorized access, use, or disclosure of your unsecured PHI
          as required by law.
        </p>
        <p>
          <b>
            <i>What are my privacy rights with respect to my PHI?</i>
          </b>
        </p>
        <p>
          We are required by law to maintain the privacy of your PHI and other personal information,
          to provide this Notice to you and to abide by the terms of this Notice, and to tell you if
          there has been a breach that compromises your PHI or other personal information.
        </p>
        <p>
          <b>
            <i>What other rights do I have with respect to my PHI?</i>
          </b>
        </p>
        <p>You have the following rights regarding the PHI that EllaMD maintains about you:</p>
        <p>
          <b>
            <i>Right to Inspect and Receive Copies</i>
          </b>{" "}
          – With some exceptions, you have the right to inspect and receive copies of the PHI used
          to make decisions about your care, provided you submit a request in writing to do so.
          Typically this includes medical and/or billing records. EllaMD may deny your request to
          inspect such PHI in limited circumstances, but must inform you of the reason for such a
          denial and you have the right to request a review of the denial. EllaMD may charge a
          reasonable fee for the costs of processing your request. Please contact EllaMD at
          <a href="mailto:support@ellamd.com">support@ellamd.com</a> to make such a request.
        </p>
        <p>
          <b>
            <i>Right to Amend</i>
          </b>{" "}
          – If you believe EllaMD is maintaining PHI about you that is inaccurate or incomplete, you
          have the right to request an amendment to your record, provided you submit a request in
          writing and state a reason that supports your request. EllaMD may deny your request to
          amend your record if such a request is not submitted in writing and/or does not include a
          reason supporting your request. EllaMD also may deny your request if you ask us to amend
          information that EllaMD did not create (unless the person or entity that created the
          information is no longer available to make the amendment), is not part of the records used
          by EllaMD to make decisions about you, and/or is not part of the information you are
          permitted to inspect and to receive a copy of, or is accurate and/or complete. Please
          contact EllaMD at <a href="mailto:support@ellamd.com">support@ellamd.com</a> to make such
          a request.
        </p>
        <p>
          <b>
            <i>Right to an Accounting of Disclosures</i>
          </b>{" "}
          – You have the right to get a list of the disclosures EllaMD has made of your PHI. This
          list will not include all disclosures EllaMD has made; for example, this list will not
          include disclosures EllaMD has made for purposes of treatment, payment, or health care
          operations, or disclosures that you specifically approved. You can request this list to
          include disclosures for up to six years prior to the date of the request. The first
          request in a 12-month period is provided to you at no cost. There may be a charge for
          subsequent requests within the same 12-month period. To request this list, you must do so
          in writing and on the approved form, which will be provided to you upon request. Please
          contact EllaMD at <a href="mailto:support@ellamd.com">support@ellamd.com</a> to make such
          a request.
        </p>
        <p>
          <b>
            <i>Right to Request Restrictions</i>
          </b>{" "}
          – You have the right to request a restriction or limitation on the PHI that EllaMD uses or
          discloses for purposes of treatment, payment, or health care operations. You also have the
          right to request a limitation on the PHI that EllaMD uses or discloses to someone who is
          involved in your care (or in the payment for your care) (e.g., family, friend). Subject to
          certain exceptions, EllaMD is not required to comply with your request; however, if EllaMD
          agrees to comply with your request, we will fulfill your request unless the information is
          needed to provide you with emergency treatment or if otherwise required by federal or
          state law. To request such restrictions or limitations, you must do so in writing and on
          the approved form, which will be provided to you upon request. Please contact EllaMD at
          <a href="mailto:support@ellamd.com">support@ellamd.com</a> to make such a request.
        </p>
        <p>
          <b>
            <i>Right to Request Confidential Communications</i>
          </b>{" "}
          – You have the right to request confidential communications of your PHI. You may request
          that EllaMD communicate with you through specific means or at a specific location. EllaMD
          will attempt to accommodate all reasonable requests. To request such confidential
          communications, you must do so in writing and on the approved form, which will be provided
          to you upon request. Please contact EllaMD at{" "}
          <a href="mailto:support@ellamd.com">support@ellamd.com</a> to make such a request.
        </p>
        <p>
          <b>
            <i>Right to a Paper Copy of This Notice</i>
          </b>{" "}
          – You may request that EllaMD provide you with a written copy of this Notice at any time.
          Even if you have agreed to receive this Notice electronically, you have a right to a paper
          copy of this Notice if you so desire. Please contact EllaMD at
          <a href="mailto:support@ellamd.com">support@ellamd.com</a> to make such a request.
        </p>
        <p>
          <b>
            <i>Right to Require Written Authorization</i>
          </b>{" "}
          – Any uses or disclosures of your PHI, other than those described above, will be made only
          with your advance written authorization, which you may grant or revoke at any time.
        </p>
        <p>
          <b>
            <i>How will I know about any changes made to the information in this Notice?</i>
          </b>
        </p>
        <p>
          EllaMD is required to abide by the terms of this notice as currently in effect. EllaMD
          reserves the right to change the terms of this notice and to make such revised notice
          provisions effective for all PHI and other personal information that we, and/or our
          business associates, maintain. In the event that we make changes to this Notice, a revised
          Notice will be posted on the Site. You agree by continued use of the Site and Services to
          accept such a revised Notice.
        </p>
        <p>
          <b>
            <i>What if I need to make a complaint?</i>
          </b>
        </p>
        <p>
          If you believe that your privacy has been violated, or that EllaMD has not followed its
          legal obligations under HIPAA, you may file a complaint with us or with the Secretary of
          the U.S. Department of Health and Human Services (“Secretary”). We will not retaliate or
          penalize you for filing a complaint with EllaMD or the Secretary.
        </p>
        <p>To file a complaint with EllaMD or to receive more information contact:</p>
        <p>
          E-mail Address:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <a href="mailto:support@ellamd.com">support@ellamd.com</a> &nbsp;
        </p>
        <p>Mailing Address:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 320 Alabama Street #11</p>
        <p>San Francisco, California 94110</p>
        <p>
          To file a complaint with the Secretary of the U.S. Department of Health and Human
          Services, call (877) 696-6775 or write to:
        </p>
        <p>Hubert H. Humphrey Building</p>
        <p>200 Independence Ave., S.E.,</p>
        <p>Washington, D.C. 20201</p>
        <p>
          <b>
            <i>Who must abide by the terms of this Notice?</i>
          </b>
        </p>
        <p>This Notice pertains to the actions to be taken by:</p>
        <p>
          <span>
            ·<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </span>{" "}
          Any physician or other health care professional authorized by EllaMD to access and/or
          enter information into your medical record (“Treating Provider”);
        </p>
        <p>
          <span>
            ·<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </span>{" "}
          All departments and units through which EllaMD’s Services are provided; and
        </p>
        <p>
          <span>
            ·<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </span>{" "}
          All EllaMD affiliates and volunteers.
        </p>
        <p>
          <b>
            <i>
              Your personal health care providers may have different policies or notices of privacy
              practices regarding the use and disclosure of your health information created in their
              offices.
            </i>
          </b>
        </p>
        <p>
          <b>
            <i>Who may I contact with questions about this Notice?</i>
          </b>
        </p>
        <p>
          For more information on EllaMD’s privacy policies or your rights under HIPAA, contact
          EllaMD’s Secretary, Praveen Ramineni, at support@ellamd.com.
        </p>
      </div>
    );
  }
}
