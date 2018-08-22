import * as React from "react";
import {RouteComponentProps} from "react-router-dom";

import * as styles from "../index.css";

interface Props extends RouteComponentProps<any> {}

/**
 * The TermsOfUsePage is a static page with EllaMD's privacy policy.
 *
 * NOTE: This HTML is exported from Word and cleaned up.
 */
export class TermsOfUsePage extends React.Component<Props> {
  public render() {
    return (
      <div className={["pt-card", styles.legalDocument].join(" ")}>
        <h2>Terms of Use</h2>
        <p><b><i>Last Revised July 14, 2017 (“Effective Date”)</i></b></p>
        <p><b><i>Please review these Terms of Use carefully before using the
        Services. We may change these Terms of Use or modify any features of the
        Services at any time. The most current version of these Terms of Use can be
        viewed by clicking on the “Terms of Use” link posted at
        <span> https://my.ellamd.com/terms-of-use</span>. You accept these Terms of
        Use by using the Services, and you accept any changes to these Terms of Use
        by continuing to use the Services.</i></b></p>
        <p>1.<span>&nbsp;&nbsp;&nbsp;&nbsp;</span> <b>Use of the Site.</b> EllaMD,
        Inc. (“EllaMD”, “we”, “us”, or “our”) provides access to personalized skin
        care services, including delivery of personalized dermatological products.
        EllaMD operates the website located at
        <a href="https://www.ellamd.com">https://www.ellamd.com</a> and other related
        websites and mobile applications (collectively, the “Site”) with links to
        these terms and conditions of use (“Terms of Use”). These Terms of Use govern
        your use of the Site and the services and/or products available to you
        through the Site (collectively, the “Services”). By: (a) accessing and using
        the Site, (b) purchasing and/or using any Services provided by us thereunder,
        and/or (c) providing your personal information to us, you agree to be bound
        by these Terms of Use and all other terms and policies that appear on the
        Site, whether or not you register for an account with EllaMD (“Account”)
        through the Site. Your compliance with these Terms of Use is a condition to
        your use of this Site. If you do not wish to be bound by any of these Terms
        of Use, you may not use the Site or the Services and, as such, must promptly
        exit this Site. <b>PLEASE REVIEW THESE TERMS OF USE CAREFULLY.&nbsp; THIS
        WEBSITE IS NOT INTENDED FOR THE DIAGNOSIS AND TREATMENT OF SKIN
        CANCER.</b></p>
        <p>2.<span>&nbsp;&nbsp;&nbsp;&nbsp;</span> <b>Services.</b> EllaMD does not
        itself provide any physicians’ or other health care providers’ services. All
        Services are provided through DermDocs, Professional Corporation and its
        contracted providers (“Treating Providers”) are independent professionals who
        are solely responsible for the services each provides to you. EllaMD does not
        practice medicine or any other licensed profession, and does not interfere
        with the practice of medicine or any other licensed profession by Treating
        Providers, each of whom is responsible for his/her services and compliance
        with the requirements applicable to his/her profession and license. Any
        information or advice you receive from a Treating Provider comes from him/her
        alone, and not from EllaMD. Neither EllaMD nor any third parties who promote
        the Services or provide you with a link to the Service shall be liable for
        any professional advice you obtain from a Treating Provider via the Services.
        EllaMD does not endorse any specific physicians, tests, medications,
        products, procedures, or the like that may be recommended by a Treating
        Provider. You acknowledge that your reliance on any Treating Provider, or on
        information provided by any Treating Provider, is solely at your own risk and
        that you assume full responsibility for all risk associated herewith. <b>IF
        YOU ARE EXPERIENCING A MEDICAL EMERGENCY, YOU SHOULD DIAL “911”
        IMMEDIATELY.&nbsp; NEITHER ELLA MD NOR DERMDOCS MANUFACTURE THE CREAM
        PRODUCTS PRESCRIBED BY THE TREATING PROVIDERS.</b></p>
        <p>3.<span>&nbsp;&nbsp;&nbsp;&nbsp;</span> <b>Site Content.</b> None of the
        Site content (other than information you receive from Treating Providers)
        should be considered medical advice or an endorsement, representation, or
        warranty that any particular medication or treatment is safe, appropriate, or
        effective for you. Although EllaMD attempts to ensure the accuracy and
        integrity of the information on the Site, EllaMD makes no representations,
        warranties, or guarantees as to the accuracy of the Site and its content, and
        as such it is possible that the Site could include typographical or other
        errors, or inaccuracies, and that unauthorized additions, deletions, and/or
        alterations could be made to the Site by third parties. In the event that any
        inaccuracy arises, please inform EllaMD so that it can be corrected.
        Information on the Site may be changed or updated without specific notice to
        you. Additionally, EllaMD shall have no responsibility or liability for
        information posted to the Site from any non-EllaMD affiliated party.</p>
        <p>4.<span>&nbsp;&nbsp;&nbsp;&nbsp;</span> <b>Informed Consent.</b></p>
        <p>a.<span>&nbsp;&nbsp;&nbsp;&nbsp;</span> Among the benefits of EllaMD’s
        Services are improved access to health care professionals and convenience.
        However, the Services you receive from Treating Providers are not intended to
        replace a primary care physician relationship. You may form an ongoing
        treatment relationship with some Treating Providers. However, your initial
        interactions with a Treating Provider will begin as a consultation and will
        not necessarily give rise to an ongoing treatment relationship with that
        Treating Provider. You should seek emergency help or follow-up care when
        recommended by a Treating Provider or when otherwise needed, and continue to
        consult with your primary care physician and other health care professionals
        as recommended.</p>
        <p>b.<span>&nbsp;&nbsp;&nbsp;&nbsp;</span> As with any health care services,
        there are potential risks associated with the use of the Services on the
        Site. These risks include, but may not be limited to:</p>
        <p>
        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        i.<span>&nbsp;&nbsp;&nbsp;&nbsp;</span> In rare cases, information
        transmitted may not be sufficient (e.g., poor resolution of images) to allow
        for appropriate health care decision making by the Treating Provider;</p>
        <p>
        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        ii.<span>&nbsp;&nbsp;&nbsp;&nbsp;</span> Delays in evaluation or treatment
        could occur due to failures of the electronic equipment. If this happens, you
        may be contacted by phone or other means of communication;</p>
        <p>
        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        iii.<span>&nbsp;&nbsp;&nbsp;&nbsp;</span> In rare cases, a lack of access to
        all of your health records may result in adverse drug interactions or
        allergic reactions or other judgment errors;</p>
        <p>
        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        iv.<span>&nbsp;&nbsp;&nbsp;&nbsp;</span> Although the electronic systems we
        use will incorporate network and software security protocols to protect the
        privacy and security of health information, in rare instances, security
        protocols could fail, causing a breach of privacy of personal health
        information</p>
        <p>c.<span>&nbsp;&nbsp;&nbsp;&nbsp;</span> By accepting these Terms of Use,
        you acknowledge that you understand and agree with the following:</p>
        <p>
        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        i.<span>&nbsp;&nbsp;&nbsp;&nbsp;</span> You understand that you may expect
        the anticipated benefits from the use of the Services in your care, but that
        no results can be guaranteed or assured;</p>
        <p>
        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        ii.<span>&nbsp;&nbsp;&nbsp;&nbsp;</span> You understand that the laws that
        protect the privacy and security of health information apply to the Services,
        and you have received EllaMD’s Notice of Privacy Practices, which describes
        these protections in more detail. Electronic communications are directed to
        your Treating Provider(s) and their supervisees through a secure, encrypted
        image interface and electronic health record;</p>
        <p>
        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        iii.<span>&nbsp;&nbsp;&nbsp;&nbsp;</span> You understand that EllaMD does not
        take nor bill insurance providers for any of the Services offered;</p>
        <p>
        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        iv.<span>&nbsp;&nbsp;&nbsp;&nbsp;</span> &nbsp;Your Treating Provider may
        determine that the Services are not appropriate for some or all of your
        treatment needs, and accordingly may elect not to provide Services to you
        through the Site.</p>
        <p>5.<span>&nbsp;&nbsp;&nbsp;&nbsp;</span> <b>Privacy.</b> EllaMD is required
        to comply with the federal health care privacy and security laws and to
        maintain safeguards to protect the security of your health information. The
        information you provide to your Treating Provider while utilizing the
        Services is legally confidential, except for certain legal exceptions as more
        fully described in our Notice of Privacy Practices. We devote considerable
        effort toward ensuring that your personal information is secure. Information
        regarding our use of health and other personal information is provided in our
        Site Privacy Policy and Notice of Privacy Practices. As part of providing you
        the Services, we may need to provide you with certain communications, such as
        reminders, service announcements, and administrative messages. These
        communications are considered part of the Services and your Account. While
        secure electronic messaging is always preferred to unsecure e-mail, under
        certain circumstances, unsecure e-mail communication containing personal
        health information may take place between you and EllaMD. EllaMD cannot
        ensure the security or confidentiality of messages sent by e-mail.
        Information relating to your care, including clinical notes and medical
        records, are stored on secure, encrypted servers. You agree that EllaMD may
        send to you any privacy or other notices, disclosures, or communications
        regarding the Services (collectively, “Communications“) through electronic
        means including but not limited to: (1) by e-mail, using the address that you
        provided to us during the registration process; (2) short messaging service
        (“SMS”) text message to the mobile number you provided us during the
        registration process; (3) push notifications on your mobile device; or (4) by
        posting the Communications on the Site. The delivery of any Communications
        from us is effective when sent by us, regardless of whether you read the
        Communication when you receive it or whether you actually receive the
        delivery. You can withdraw your consent to receive Communications by e-mail
        by canceling or discontinuing your use of the Service. You can opt-out of
        future Communications through SMS text message by replying “STOP”. <b>PLEASE
        CONSULT OUR SITE PRIVACY POLICY AND NOTICE OF PRIVACY PRACTICES FOR A
        DESCRIPTION OF OUR PRIVACY PRACTICES AND POLICIES, INCLUDING HOW WE COLLECT
        AND HANDLE YOUR PERSONAL HEALTH INFORMATION.</b></p>
        <p>6.<span>&nbsp;&nbsp;&nbsp;&nbsp;</span> <b>User Accounts.</b> When you
        register on the Site, you are required to create an account (“Account”) by
        entering your name and e-mail address, a password, and certain other
        information collected by EllaMD (collectively “Account Information”). To
        create an Account, you must be of legal age to form a binding contract. If
        you are not of legal age to form a binding contract, you may not register to
        use our Services. You agree that the Account Information that you provide to
        us at all times, including during registration and in any information you
        upload to the Site will be true, accurate, current, and complete. You may not
        transfer or share your Account password with anyone, or create more than one
        Account. You are responsible for maintaining the confidentiality of your
        Account password and for all activities that occur under your Account. EllaMD
        reserves the right to take any and all action, as it deems necessary or
        reasonable, regarding the security of the Site and your Account Information.
        In no event and under no circumstances shall EllaMD be held liable to you for
        any liabilities or damages resulting from or arising out of your use of the
        Site, your use of the Account Information or your release of the Account
        Information to a third party. You may not use anyone else’s account at any
        time.</p>
        <p>7.<span>&nbsp;&nbsp;&nbsp;&nbsp;</span> <b>User Information.</b> If you
        submit, upload, post, or transmit any health information, medical history,
        conditions, problems, symptoms, personal information, consent forms,
        agreements, requests, comments, ideas, suggestions, information, files,
        videos, images, or other material to EllaMD or our Site (“User Information”),
        you agree not to provide any User Information that: (a) is false, inaccurate,
        defamatory, abusive, libelous, unlawful, obscene, threatening, harassing,
        fraudulent, pornographic, or harmful, or that could encourage criminal or
        unethical behavior; (b) violates or infringes the privacy, copyright,
        trademark, trade dress, trade secrets, or intellectual property rights of any
        person or entity; or (c) contains or transmits a virus or any other harmful
        component. You agree not to contact other Site users through unsolicited
        e-mail, telephone calls, mailings, or any other method of communication. You
        represent and warrant to EllaMD and its Treating Providers that you have the
        legal right and authorization to provide all User Information to EllaMD and
        its Treating Providers for use as set forth herein, and as required by EllaMD
        and the Treating Provider.</p>
        <p>8.<span>&nbsp;&nbsp;&nbsp;&nbsp;</span> <b>Use of the Services by
        Individuals Under Age 18.</b> This Site is not directed to children and
        children are not eligible to use our Services. We will not knowingly collect
        information from Site users under the age of eighteen (18). If you are under
        age 18, please do not attempt to use the Site or any of our Services or
        provide any personal information about yourself to us. If we learn that we
        have collected personal information from a child under 18, we will delete
        that information as quickly as possible.</p>
        <p>9.<span>&nbsp;&nbsp;&nbsp;&nbsp;</span> <b>Access Rights.</b> EllaMD
        hereby grants to you a limited, non-exclusive, non-transferable right to
        access the Site and use the Services solely for your personal non-commercial
        use and only as permitted under these Terms of Use and any separate
        agreements you may have entered into with us (“Access Rights”). EllaMD
        reserves the right, in our sole discretion, to deny or suspend use of the
        Site or Services to anyone for any reason. You agree that you will not, and
        you will not attempt to: (a) impersonate any person or entity, or otherwise
        misrepresent your affiliation with a person or entity; (b) use the Site or
        Services to violate any local, state, national, or international law; (c)
        reverse engineer, disassemble, decompile, or translate any software or other
        components of the Site or Services; (d) distribute viruses or other harmful
        computer code through the Site or (e) otherwise use the Services or Site in
        any manner that exceeds the scope of use granted above. In addition, you
        agree to refrain from abusive language and behavior which could be regarded
        as inappropriate, or conduct that is unlawful or illegal, when communicating
        with Treating Providers through the Site and to refrain from contacting
        Treating Providers for services outside of the Site. EllaMD is not
        responsible for any interactions with Treating Providers that are not
        conducted through the Site. We strongly recommend that you do not use the
        Site or any of its Services on public computers. We also recommend that you
        do not store your Account password through your web browser or other
        software.</p>
        <p>10.<span>&nbsp;</span> <b>Fees and Purchase Terms.</b> You agree to pay
        all fees or charges to your Account in accordance with the fees, charges, and
        billing terms in effect at the time a fee or charge is due and payable. By
        providing EllaMD with your credit card number and associated payment
        information, you agree that EllaMD is authorized to immediately invoice your
        account for all fees and charges due and payable to EllaMD hereunder and that
        no additional notice or consent is required. You acknowledge and agree that
        you shall be personally responsible for all incurred expenses. EllaMD does
        not take nor bill insurance providers for any of the Services offered, nor
        does EllaMD offer any guarantee that you shall receive any reimbursement from
        your insurance provider for any of the Services offered (should you choose to
        submit a claim for reimbursement directly). EllaMD reserves the right to
        modify or implement a new pricing structure at any time prior to billing you
        for your initial payment or for future payments due pursuant to these Terms
        of Use.</p>
        <p>11.<span>&nbsp;</span> <b>Website Links.</b> EllaMD will not be liable for
        any information, software, or links found at any other website, internet
        location, or source of information, nor for the acts or omissions of any such
        websites or their respective operators.</p>
        <p>12.<span>&nbsp;</span> <b>Ownership.</b> The Site and its entire contents,
        features, and functionality (including but not limited to all information,
        software, text, displays, images, video, and audio, and the design,
        selection, and arrangement thereof), are owned by EllaMD, its licensors, or
        other providers of such material, and are protected by United States and
        international copyright, trademark, patent, trade secret, and other
        intellectual property or proprietary rights laws. These Terms of Use permit
        you to use the Site for your personal, non-commercial use only. You must not
        reproduce, distribute, modify, create derivative works of, publicly display,
        publicly perform, republish, download, store, or transmit any of the material
        on our Site except as generally and ordinarily permitted through the Site
        according to these Terms of Use. You must not access or use for any
        commercial purposes any part of the Site or any services or materials
        available through the Site.</p>
        <p>13.<span>&nbsp;</span> <b>Trademarks.</b> Certain of the names, logos, and
        other materials displayed on the Site or in the Services may constitute
        trademarks, trade names, service marks or logos (“Marks“) of EllaMD or other
        related entities. You are not authorized to use any such Marks without the
        express written permission of EllaMD. Ownership of all such Marks and the
        goodwill associated therewith remains with us or those other entities.</p>
        <p>14.<span>&nbsp;</span> <b>Termination.</b> You may deactivate your Account
        and end your Site registration at any time, for any reason, by sending an
        e-mail to <a href="mailto:support@ellamd.com">support@ellamd.com</a>. EllaMD
        may suspend or terminate your use of the Site, your Account, and/or your
        registration for any reason at any time. Subject to applicable law, EllaMD
        reserves the right to maintain, delete or destroy all communications and
        materials posted or uploaded to the Site pursuant to its internal record
        retention and/or content destruction policies. After such termination, EllaMD
        will have no further obligation to provide the Services, except to the extent
        we are obligated to provide you access to your health records or Treating
        Providers are required to provide you with continuing care under their
        applicable legal, ethical, and professional obligations to you.</p>
        <p>15.<span>&nbsp;</span> <b>Right to Modify.</b> EllaMD may, at our sole
        discretion, change, add, or delete portions of these Terms of Use at any time
        on a going-forward basis. Continued use of the Site and/or Services following
        notice of any such changes will indicate your acknowledgement of such changes
        and agreement to be bound by the revised Terms of Use, inclusive of such
        changes. In order to participate in certain aspects of the Site or to receive
        certain Services, you may be required to agree to additional terms and
        conditions as posted on the Site (“Additional Terms of Use”), which are
        hereby incorporated into these Terms of Use. To the extent there is a
        conflict between the provisions in these Terms of Use and the Additional
        Terms of Use, the latter shall have precedence. The current version of these
        Terms of Use, including, without limitation, any Additional Terms of Use,
        constitute the entire, exclusive, and final agreement between you and EllaMD
        with respect to the subject matter hereof, and governs your access and use of
        the Site, superseding any and all prior or contemporaneous arrangements
        between you and EllaMD with respect to the subject matter hereof, whether
        written or oral. We recommend that you read these Terms of Use each time you
        use the Site. If you object to any changes made to these Terms of Use, your
        sole recourse will be to cease using the Site and/or any of the Services.
        Your continued access to and usage of the Site and/or the Services signifies
        your acknowledgement and acceptance of such, and your agreement to be bound
        thereby.</p>
        <p>16.<span>&nbsp;</span> <b>Disclaimer of Warranties.</b> YOU EXPRESSLY
        AGREE THAT USE OF THE SITE OR SERVICES IS AT YOUR SOLE RISK. BOTH THE SITE
        AND SERVICES ARE PROVIDED ON AN “AS IS” AND “AS AVAILABLE” BASIS. EllaMD
        EXPRESSLY DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED,
        INCLUDING, BUT NOT LIMITED TO ANY WARRANTIES OF MERCHANTABILITY, FITNESS FOR
        A PARTICULAR USE OR PURPOSE, NON-INFRINGEMENT, TITLE, OPERABILITY, CONDITION,
        QUIET ENJOYMENT, VALUE, ACCURACY OF DATA AND SYSTEM INTEGRATION. You
        acknowledge and agree that EllaMD does not provide medical advice, diagnosis,
        or treatment, and is strictly a technology platform and infrastructure for
        connecting patients with independent third party Treating Providers. You
        acknowledge and agree that the Treating Providers using the Site are solely
        responsible for and will have complete authority, responsibility,
        supervision, and control over the provision of all medical services, advice,
        instructions, treatment decisions, and other professional health care
        services performed, and that all diagnoses, treatments, procedures, and other
        professional health care services will be provided and performed exclusively
        by or under the supervision of Treating Providers, in their sole discretion,
        as they deem appropriate.</p>
        <p>17.<span>&nbsp;</span> <b>Limitation of Liability.</b> YOU UNDERSTAND THAT
        TO THE EXTENT PERMITTED UNDER APPLICABLE LAW, IN NO EVENT WILL EllaMD OR ITS
        OFFICERS, EMPLOYEES, DIRECTORS, PARENTS, SUBSIDIARIES, AFFILIATES, AGENTS, OR
        LICENSORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR
        EXEMPLARY DAMAGES, INCLUDING BUT NOT LIMITED TO, DAMAGES FOR LOSS OF
        REVENUES, PROFITS, GOODWILL, USE, DATA, OR OTHER INTANGIBLE LOSSES ARISING
        OUT OF OR RELATED TO YOUR USE OF THE SITE OR THE SERVICES, REGARDLESS OF
        WHETHER SUCH DAMAGES ARE BASED ON CONTRACT, TORT (INCLUDING NEGLIGENCE AND
        STRICT LIABILITY), WARRANTY, STATUTE OR OTHERWISE. To the extent that EllaMD
        may not, as a matter of applicable law, disclaim any implied warranty or
        limit its liabilities, the scope and duration of such warranty and the extent
        of our liability will be the minimum permitted under such applicable law.</p>
        <p>18.<span>&nbsp;</span> <b>Indemnification.</b> You agree to indemnify,
        defend, and hold harmless EllaMD, its officers, directors, employees, agents,
        subsidiaries, affiliates, licensors, and suppliers, harmless from and against
        any claim, actions, demands, liabilities, and settlements, including without
        limitation reasonable legal and accounting fees (“Claims”), resulting from,
        or alleged to result from, your violation of these terms and conditions. In
        addition, you agree to indemnify, defend, and hold harmless your Treating
        Provider(s) from and against any third party Claims resulting from your lack
        of adherence with the advice or recommendation(s) of such Treating
        Provider.</p>
        <p>19.<span>&nbsp;</span> <b>Geographical Restrictions.</b> Currently, EllaMD
        only provides the Services to patients who are residing in the State of
        California. EllaMD makes no representation that all products, services,
        and/or materials described on the Site, or the Services available through the
        Site, are appropriate or available for use in locations outside the United
        States or all territories within the United States.</p>
        <p>20.<span>&nbsp;</span> <b>Disclosures.</b> All Treating Providers
        accessible to you through the Site hold professional licenses issued by the
        professional licensing boards in the states where they practice, hold
        doctoral degrees in medicine, and have undergone post-doctoral training. You
        can report a complaint relating to services provided by a Treating Provider
        by contacting the professional licensing board in the state where the
        services were received. In a professional relationship, sexual intimacy is
        never appropriate and should be reported to the board that licenses,
        registers, or certifies the licensee. You can find the contact information
        for each of the state professional licensing boards governing medicine on the
        Federation of State Medical Boards website (
          <a href="http://www.fsmb.org/state-medical-boards/contacts">http://www.fsmb.org/state-medical-boards/contacts</a>).
        Any clinical records created as a result of your use of the Site will be
        securely maintained by EllaMD on behalf of your Treating Provider(s) for a
        period that is no less than the minimum number of years such records are
        required to be maintained under state and federal law, and which is typically
        at least six (6) years.</p>
        <p>21.<span>&nbsp;</span> <b>Miscellaneous.</b></p>
        <p>a.<span>&nbsp;&nbsp;&nbsp;&nbsp;</span> These Terms of Use and your use of
        the Site shall be governed by the laws of the State of California, without
        giving effect to the principles of conflict of laws.</p>
        <p>b.<span>&nbsp;&nbsp;&nbsp;&nbsp;</span> Any dispute arising under or
        relating in any way to these Terms of Use will be resolved exclusively by
        final and binding arbitration in San Francisco, California under the rules of
        the American Arbitration Association, except that either party may bring a
        claim related to intellectual property rights, or seek temporary and
        preliminary specific performance and injunctive relief, in any court of
        competent jurisdiction, without the posting of bond or other security. The
        parties agree to the personal and subject matter jurisdiction and venue of
        the courts located in San Francisco, California, for any action related to
        these Terms of Use.</p>
        <p>c.<span>&nbsp;&nbsp;&nbsp;&nbsp;</span> No waiver by EllaMD of any term or
        condition set forth in these Terms of Use shall be deemed a further or
        continuing waiver of such term or condition or a waiver of any other term or
        condition, and any failure of EllaMD to assert a right or provision under
        these Terms of Use shall not constitute a waiver of such right or
        provision.</p>
        <p>d.<span>&nbsp;&nbsp;&nbsp;&nbsp;</span> If any provision of these Terms of
        Use is held by a court or other tribunal of competent jurisdiction to be
        invalid, illegal, or unenforceable for any reason, such provision shall be
        eliminated or limited to the minimum extent such that the remaining
        provisions of the Terms of Use will continue in full force and effect.</p>
        <p>e.<span>&nbsp;&nbsp;&nbsp;&nbsp;</span> EllaMD will not be deemed to be in
        breach of these Terms of Use or liable for any breach of these Terms of Use
        and/or our Site Privacy Policy, due to any event or occurrence beyond our
        reasonable control, including without limitation, acts of God, terrorism,
        war, invasion, failures of any public networks, electrical shortages,
        earthquakes or floods, civil disorder, strikes, fire, or other disasters.</p>
        <p>f.<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> If EllaMD or its assets are
        acquired by another company, or in the event of a merger, consolidation,
        change in control, transfer of substantial assets, reorganization, or
        liquidation, EllaMD may transfer, sell, or assign to third parties rights
        related to your relationship with EllaMD, including, without limitation, your
        Account and any personal information that you provided or that has been
        provided on your behalf to EllaMD. Such third parties will: (i) assume
        responsibility for your relationship with EllaMD; (ii) assume responsibility
        for information collected by EllaMD in connection with EllaMD’s business
        operations or the Site, and (iii) assume responsibility for the rights and
        obligations regarding such information as described in these Terms of Use.
        These Terms of Use shall be binding upon and inure to the benefit of EllaMD’s
        successors and assigns. You may not assign your rights under these Terms of
        Use without our prior written consent, and any attempted assignment will be
        null and void.</p>
        <p>g.<span>&nbsp;&nbsp;&nbsp;&nbsp;</span> EllaMD devotes considerable effort
        to optimizing signal strength and diagnosis deficiencies but is not
        responsible for the internet or data bandwidth and signal of your mobile
        device.</p>
        <p>h.<span>&nbsp;&nbsp;&nbsp;&nbsp;</span> The Digital Millennium Copyright
        Act of 1998 (the “DMCA“) provides recourse for copyright owners who believe
        that material appearing on the Internet infringes their rights under U.S.
        copyright law. If you believe in good faith that materials appearing on this
        website infringe your copyright, you (or your agent) may send us a notice
        requesting that the material be removed, or access to it blocked. In
        addition, if you believe in good faith that a notice of copyright
        infringement has been wrongly filed against you, the DMCA permits you to send
        us a counter-notice. Notices and counter-notices must meet statutory
        requirements imposed by the DMCA. One place to find more information is the
        U.S. Copyright Office Web site, currently located at
        <a href="http://www.loc.gov/copyright">http://www.loc.gov/copyright</a>. In
        accordance with the DMCA, EllaMD has designated an agent to receive
        notification of alleged copyright infringement in accordance with the DMCA.
        Any written notification of alleged copyright infringement should comply with
        Title 17, United States Code, Section 512(c)(3)(A) and should be provided in
        writing to EllaMD, Inc., 320 Alabama Street #11, San Francisco, California
        94110.</p>
        <p>22.<span>&nbsp;</span> <b>Reporting Violations.</b> You should report any
        suspected violations of these Terms of Use to
        <a href="mailto:support@ellamd.com">support@ellamd.com</a>.</p>
        <p>23.<span>&nbsp;</span> <b>Questions.</b> If you have any questions or
        concerns about these Terms of Use, please contact us at
        <a href="mailto:support@ellamd.com">support@ellamd.com</a>.</p>
        <p>24.<span>&nbsp;</span> You understand that by checking the “agree” box for
        these Terms of Use and/or any other forms presented to you on the Site you
        are agreeing to these Terms of Use and that such action constitutes a legal
        signature.</p>
      </div>
    );
  }
}
